
// Main config object

export interface ReportConfig {
    name: string;
    dataPoints: DataPointConfig[];
    pages: Page[];
    mainPage: string;
}


// Data points definitions

export type DataPointConfig =
    | TextInputDataPoint
    | NumberInputDataPoint
    | ChoiceInputDataPoint
    | TableInputDataPoint
    | AddressInputDataPoint
    | FileInputDataPoint
    | TimeDataInputPoint
    | TimeDataRangeInputPoint;

export type DataPointType =
    | 'text'
    | 'number'
    | 'choice'
    | 'table'
    | 'address'
    | 'file'
    | 'time'
    | 'time-range';

interface ConfigDataPointBase {
	id: string;
	type: DataPointType;
	label: string;
	valueOptions: { [key: string]: unknown };
	multiple?: boolean; // does it accept multiple values? default: false
}

export interface TextInputDataPoint extends ConfigDataPointBase {
	type: 'text';
	valueOptions: {
		multiline?: boolean; // default: false
	};
}

export interface NumberInputDataPoint extends ConfigDataPointBase {
	type: 'number';
	valueOption: {
		unit?: string;
	};
}

export interface ChoiceInputDataPoint extends ConfigDataPointBase {
	type: 'choice';
	valueOptions: {
		options: string[];
	};
}

export interface AddressInputDataPoint extends ConfigDataPointBase {
	type: 'address';
	valueOptions: {
		addressType: 'full' | 'city' | 'country'; 
	};
}


export interface TimeDataInputPoint extends ConfigDataPointBase {
	type: 'time';
	value: Date[];
	valueOptions: {
		timeType: 'dateTime' | 'date' | 'month' | 'year';
	};
}

export interface TimeDataRangeInputPoint extends ConfigDataPointBase {
	type: 'time-range';
	value: Date[] | [Date, Date];
	valueOptions: {
		timeType: 'dateTime' | 'date' | 'month' | 'year';
	};
}

export interface FileInputDataPoint extends ConfigDataPointBase {
	type: 'file';
	value: { name: string; url: string }[];
	valueOptions: {
		fileTypes: string;
	};
}

export type TableCellValue = number | string | string[];

export type CellType = 'time' | 'text' | 'number' | 'choice';

export type TableDatapointCellConfig =
    | TableTextCellConfig
    | TableTimeCellConfig
    | TableNumberCellConfig
    | TableChoiceCellConfig;

export interface TableInputDataPoint extends ConfigDataPointBase {
	type: 'table';
	value: {
		[key: string]: TableCellValue;
	}[];
	valueOptions: {
        // Named indexes are used to predefine named rows of the table
        // For each label a row will be added with that label used as its name
        // If not defined, users will be able to add new rows themselves
		namedIndexesColumn?: {
			headerName: string;
			labels: string[];
		};
        // 'field' defines key by which data for each column will be later accessable in functions
		columns: {
			field: string;
			headerName: string;
			input: TableDatapointCellConfig;
		}[];
	};
}

export interface ConfigTableDataPointCellBaseConfig {
    type: CellType;
    valueOptions?: { [key: string]: unknown };
}


export interface TableTextCellConfig
	extends ConfigTableDataPointCellBaseConfig {
	type: 'text';
	multiple?: boolean;
}

export interface TableChoiceCellConfig
	extends ConfigTableDataPointCellBaseConfig {
	type: 'choice';
	multiple?: boolean;
	valueOptions: {
		options: string[];
	};
}

export interface TableNumberCellConfig
	extends ConfigTableDataPointCellBaseConfig {
	type: 'number';
	valueOptions: {
		unit?: string;
	};
}

export interface TableTimeCellConfig
	extends ConfigTableDataPointCellBaseConfig {
	type: 'time';
	valueOptions: {
		timeType?: 'dateTime' | 'date' | 'month' | 'year';
	};
}


// Pages, blocks an visualizations 

export interface Page {
	id: string;
	name?: string;
	entityPath?: string[]; // used when a page is supposed to be within a list ex. "listID1/listID2"
	description: string;
	blocks: Block[];
	placeholderFunction?: string;
	withNavigation?: boolean;
}

export type BlockType = 'questionnaire' | 'dashboard';

export type Block = DashboardBlock | QuestionnaireBlock;

export interface BlockBase {
	name: string;
	type: BlockType;
}

export interface DashboardBlock extends BlockBase {
	type: 'dashboard';
	segments: SegmentConfig[];
}

export interface SegmentConfig {
	visualizations: VisualizationConfig[];
	title: string;
	// pageID
	pageLink: string;
}

export type VisualizationType =
	| 'progress'
	| 'barChart'
	| 'table'
	| 'donutChart'
    | 'lineChart'
    | 'text';

export type VisualizationConfig =
	| ProgressVisualizationConfig
	| BarChartVisualizationConfig
	| DonutChartVisualizationConfig
	| LineChartVisualizationConfig
	| TextVisualizationConfig
	| TableVisualizationConfig;

interface VisualizationBase {
	type: VisualizationType;
	visualizationOptions: { [key: string]: unknown };
	aggregationFunction?: () => any;
}

export interface ProgressVisualizationConfig extends VisualizationBase {
	type: 'progress';
    // value field represents how value passed by aggregation function should be formed
	value?: {
		values: [number, number] // 1st number represents completed, 2nd number total steps
	};
	visualizationOptions: {
		label?: string;
		size?: 'slim' | 'medium' | 'thick';
	};
}

export interface DonutChartVisualizationConfig extends VisualizationBase {
	type: 'donutChart';
	value?: {
		percentValue?: number; // float 0 - 1 that will be transformed to %, e.g. 0.38 => 38%
	};
	visualizationOptions: {
		label?: string;
	};
}

export interface TextVisualizationConfig extends VisualizationBase {
	type: 'text';
	value?: number | string;
	visualizationOptions: {
		label?: string;
		size?: 'small' | 'medium' | 'large';
	};
}

export interface TableVisualizationConfig extends VisualizationBase {
	type: 'table';
    // each object in the value array will be represented as row in the table
    // use 'field' value defined for each column in visualizationOptions as key to provide values for cells
	value?: {
		[key: string]: TableCellValue;
	}[];
	visualizationOptions: {
		columns: { field: string; headerName: string; type: ColumnTypes }[];
	};
}

export type ColumnTypes =
	| 'text'
	| 'progressBar';

export interface BarChartVisualizationConfig extends VisualizationBase {
	type: 'barChart';
    // each bar is represented by [label, value], e.g. [["Berlin", 3.5], ["Cologne", 1.1]]
	value?: (number | string)[][];
	visualizationOptions: {
		valuesAxisLabel?: string;
		labelsAxisLabel?: string;
		direction?: 'horizontal' | 'vertical'; // default: 'vertical'
	};
}

export interface LineChartVisualizationConfig extends VisualizationBase {
	type: 'lineChart';
    // values are defined the same as for bar chart
	value: (number | string)[][];
	visualizationOptions: {
		valuesAxisLabel?: string;
		labelsAxisLabel?: string;
	};
}

export interface QuestionnaireBlock extends BlockBase {
    type: 'questionnaire';
    sections: QuestionnaireSectionConfig[];
}

export interface QuestionnaireSectionConfig {
	name?: string;
	cards: QuestionnaireCardConfig[];
}

export interface QuestionnaireCardConfig {
	name?: string;
	dataPointIDs: string[];
	showCondition?: () => boolean;
}

