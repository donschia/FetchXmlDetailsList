import * as React from 'react';
import { TableRowId } from '@fluentui/react-components';
import { IDynamicDetailsListProps, IDynamicDetailsListState, ILegacyColumn, ICustomButtonConfig, ICustomButtonComponent, IColumnDataStructure } from './types';
import { DataService } from './dataService';
import { renderItemColumn } from './CellRenderer';
import { DataGridWrapper } from './DataGridWrapper';
import { compareValues, normalizeColumns } from './columnUtils';
import { openCustomPage } from './utils/customPageNavigation';
import packageJson from '../package.json';


export class DynamicDetailsList extends React.Component<IDynamicDetailsListProps, IDynamicDetailsListState> {
    private _allItems: any[];
    private _pcfContext: any;
    private _primaryEntityName: string;
    private _fetchXml: string;
    private _announcedMessage?: string;
    private _baseEnvironmentUrl?: string;
    private dataService: DataService;
    private _customButtonConfigs: ICustomButtonConfig[] = [];
    private _customButtonComponents: ICustomButtonComponent[] = [];

    // Cache legacy columns for min width calculation
    private _legacyColumns: ILegacyColumn[] = [];

    private ensureRowIds(items: any[], primaryEntityName: string): any[] {
        const seen = new Map<string, number>();
        return (items || []).map((item: any) => {
            if (!item || typeof item !== 'object') return item;
            if (item.__rowId) return item;

            const primaryId = item[primaryEntityName + 'id'];
            // Build a deterministic fallback from all non-metadata field values
            // Sort keys to guarantee stable order regardless of JS engine behavior
            const baseId = primaryId || Object.keys(item)
                .filter(k => !k.startsWith('@') && k !== '__rowId')
                .sort()
                .map(k => String(item[k] ?? ''))
                .join('|');

            // Deduplicate: if two rows produce the same key, append a counter
            const count = seen.get(baseId) || 0;
            seen.set(baseId, count + 1);
            const rowId = count === 0 ? baseId : `${baseId}__${count}`;

            return { ...item, __rowId: rowId };
        });
    }

    // Handle cell click - select row and focus cell (Dataverse behavior)
    private handleCellClick = (item: any, column: ILegacyColumn, event: React.MouseEvent) => {
        const rowId = item.__rowId || item[this._primaryEntityName + "id"];
        const cellId = `${rowId}-${column.key}`;

        // Don't change selection if clicking on a checkbox
        const target = event.target as HTMLElement;
        if ((target as HTMLInputElement).type === 'checkbox' || target.closest('input[type="checkbox"]')) {
            return;
        }

        // Select only this row (clear others) - Dataverse behavior
        const newSelection = new Set<TableRowId>([rowId]);
        this.setState({
            selectedRowIds: newSelection,
            focusedCellId: cellId
        });
    }

    private _renderItemColumn = (item: any, _index: number | undefined, column: ILegacyColumn): JSX.Element => {
        return renderItemColumn({
            item,
            column,
            primaryEntityName: this._primaryEntityName,
            baseEnvironmentUrl: this._baseEnvironmentUrl,
            pcfContext: this._pcfContext,
            onCellClick: this.handleCellClick
        });
    }

    constructor(props: IDynamicDetailsListProps) {
        super(props);

        this._pcfContext = props.context;
        this._primaryEntityName = props.primaryEntityName || '';
        this._fetchXml = props.fetchXml ?? '';
        this._allItems = props.items || [];
        this._baseEnvironmentUrl = props.baseD365Url;

        // Log version to console for debugging
        console.log(`FetchXml DetailsList Control v${packageJson.version}`);
        
        // Parse custom button configuration(s) from JSON string
        // Supports both single object and array format
        if (props.CustomButtonConfig) {
            try {
                const parsed = JSON.parse(props.CustomButtonConfig);
                const configs = Array.isArray(parsed) ? parsed : [parsed];
                const validConfigs = configs.filter(
                    (cfg: unknown) => cfg !== null && typeof cfg === 'object' && !Array.isArray(cfg)
                ) as ICustomButtonConfig[];

                if (validConfigs.length === 0) {
                    throw new Error('No valid custom button configurations found.');
                }

                this._customButtonConfigs = validConfigs;
                this._customButtonComponents = this.createCustomButtonComponents();
                
                if (process.env.NODE_ENV !== 'production') {
                    console.log('DynamicDetailsList constructor: CustomButtonConfig raw =', props.CustomButtonConfig);
                    console.log('DynamicDetailsList constructor: parsed =', parsed);
                    console.log('DynamicDetailsList constructor: _customButtonConfigs =', this._customButtonConfigs);
                    console.log('DynamicDetailsList constructor: _customButtonComponents =', this._customButtonComponents);
                }
            } catch (error) {
                console.error('Failed to parse custom button configuration:', error);
                this._customButtonConfigs = [];
                this._customButtonComponents = [];
            }
        }

        // Normalize legacy columns for later width calculation
        try {
            this._legacyColumns = normalizeColumns(props.columns);
        } catch {
            this._legacyColumns = [];
        }

        this.dataService = new DataService(this._pcfContext);

        this.state = {
            items: this.ensureRowIds(this._allItems || [], this._primaryEntityName),
            columns: [],
            fetchXml: this._fetchXml,
            primaryEntityName: this._primaryEntityName,
            announcedMessage: undefined,
            selectedRowIds: new Set<TableRowId>(),
            focusedCellId: undefined
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: IDynamicDetailsListProps) {
        let shouldReload = false;

        if (prevProps.fetchXml !== this.props.fetchXml) {
            this._fetchXml = this.props.fetchXml || '';
            shouldReload = true;
        }

        if (prevProps.columns !== this.props.columns) {
            try {
                this._legacyColumns = normalizeColumns(this.props.columns);
            } catch {
                this._legacyColumns = [];
            }
            shouldReload = true;
        }

        if (prevProps.CustomButtonConfig !== this.props.CustomButtonConfig) {
            if (this.props.CustomButtonConfig) {
                try {
                    const parsed = JSON.parse(this.props.CustomButtonConfig);
                    this._customButtonConfigs = Array.isArray(parsed) ? parsed : [parsed];
                    this._customButtonComponents = this.createCustomButtonComponents();
                } catch (error) {
                    console.error('Failed to parse custom button configuration:', error);
                    this._customButtonConfigs = [];
                    this._customButtonComponents = [];
                }
            } else {
                this._customButtonConfigs = [];
                this._customButtonComponents = [];
            }
        }

        if (shouldReload) {
            this.loadData();
        }
    }

    private async loadData() {
        try {
            const result = await this.dataService.fetchData(
                this._fetchXml,
                this._primaryEntityName,
                this.props.columns,
                this._renderItemColumn,
                compareValues,
                this.props.dataItems
            );

            this._allItems = result.items;
            this._primaryEntityName = result.primaryEntityName;
            this._announcedMessage = result.announcedMessage;

            const itemsWithRowIds = this.ensureRowIds(result.items, result.primaryEntityName);

            // Trim stale selection to only IDs present in new data
            const validIds = new Set(itemsWithRowIds.map((item: any) => item.__rowId as TableRowId));
            const trimmedSelection = new Set<TableRowId>(
                Array.from(this.state.selectedRowIds).filter(id => validIds.has(id))
            );

            this.setState({
                items: itemsWithRowIds,
                columns: result.columns,
                primaryEntityName: result.primaryEntityName,
                announcedMessage: result.announcedMessage,
                selectedRowIds: trimmedSelection
            });
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({
                announcedMessage: 'Error loading data'
            });
        }
    }


    private handleRefresh = () => {
        this.loadData();
    }

    private createCustomButtonClickHandler = (buttonConfig: ICustomButtonConfig) => {
        return async () => {
            try {
                // Use the record ID that's already passed from the main component
                const recordId = this.props.recordId;
                const selectedRowIds = Array.from(this.state.selectedRowIds || []);
                const selectedRecords = this.state.items.filter((item: any) => {
                    const rowId = item.__rowId || item[this._primaryEntityName + "id"];
                    return rowId && selectedRowIds.includes(rowId);
                });

                const customButtonData = {
                    parentRecordId: recordId,
                    selectedRowIds,
                    selectedRecords
                };

                await openCustomPage(buttonConfig, this._pcfContext, recordId, customButtonData);
                
                // If autoRefreshDataOnComplete is enabled, refresh the grid data after successful completion
                if (buttonConfig.autoRefreshDataOnComplete === true) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Auto-refreshing grid data after button action');
                    }
                    this.loadData();
                }
            } catch (error) {
                console.error('Failed to open custom page:', error);
            }
        };
    }

    private createCustomButtonComponents = (): ICustomButtonComponent[] => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('createCustomButtonComponents: _customButtonConfigs =', this._customButtonConfigs);
        }
        return this._customButtonConfigs.map(config => ({
            config,
            onClick: this.createCustomButtonClickHandler(config)
        }));
    }

    // Compute total minimum width for horizontal scrolling
    private getTotalMinWidth(): number {
        if (!this._legacyColumns || this._legacyColumns.length === 0) return 0;
        return this._legacyColumns.reduce((sum, col) => sum + (col.minWidth || 50), 0);
    }

    public render(): JSX.Element {
        return (
            <DataGridWrapper
                state={this.state}
                primaryEntityName={this._primaryEntityName}
                pcfContext={this._pcfContext}
                onSelectionChange={(selectedItems) => {
                    this.setState({
                        selectedRowIds: selectedItems
                    });
                }}
                onRefresh={this.handleRefresh}
                customButtonComponents={this._customButtonComponents}
                minTableWidth={this.getTotalMinWidth()}
                legacyColumns={this._legacyColumns}
                hideNewButton={this.props.hideNewButton}
                hideRefreshButton={this.props.hideRefreshButton}
                hideExportButton={this.props.hideExportButton}
                hideBulkEditButton={this.props.hideBulkEditButton}
            />
        );
    }

}