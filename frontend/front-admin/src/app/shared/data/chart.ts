import * as Chartist from 'chartist';
import { ChartEvent } from 'ng-chartist';

export interface Chart {
  type: string;
  data: Chartist.Data;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}



export var view: any[] = [409, 204];



//Options
export var doughnutChartShowLabels = false;
export var doughnutChartTooltip = false;
export var doughnutChartGradient = false;
export var doughnutChartcolorScheme = {
  domain: ["#ff7f83", "#02cccd", "#a5a5a5", "#ffbc58"],
};

// Chart 5 Line chart with area
export var chart5: Chart = {
  type: 'Line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    series: [
      [5, 9, 7, 8, 5, 3, 5, 4]
    ]
  },
  // options: {
  //   showArea: true,
  //   height: '450',
  //   low: 0,
  // }
  options: {
    height: 450,
    showArea: true,
    seriesBarDistance: 12,
    axisX: {
      showGrid: false,
      labelInterpolationFnc: function (value) {
        return value[0];
      }
    }
  },
};

//line chart
export var lineChartData: Array<any> = [
  { data: [20, 30, 50, 80, 20, 150, 120, 180, 160, 140, 110, 130], label: "Revenue" },
  { data: [5, 15, 25, 60, 90, 130, 110, 160, 80, 120, 90, 100], label: "Orders" },
  { data: [10, 20, 40, 70, 110, 160, 90, 170, 150, 130, 100, 120], label: "Users" }
];
export var lineChartLabels: Array<any> = [  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"];
export var lineChartOptions: any = {
  scaleShowGridLines: true,
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      tension: 0.5
    }
  },
};
export var lineChartColors: Array<any> = [
  {
    backgroundColor: "transparent",
    borderColor: "#01cccd",
    pointColor: "#01cccd",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "#000"
  },
  {
    backgroundColor: "transparent",
    borderColor: "#a5a5a5",
    pointColor: "#a5a5a5",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#000",
    pointHighlightStroke: "rgba(30, 166, 236, 1)",
  },
  {
    backgroundColor: "transparent",
    borderColor: "#ff7f83",
    pointColor: "#ff7f83",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#000",
    pointHighlightStroke: "rgba(30, 166, 236, 1)",
  }
];
export var lineChartLegend = true;
export var lineChartType = 'line';


//line chart
export var smallLineChartData: Array<any> = [
  { data: [20, 5, 120, 10, 140, 15] },
];
export var smallLineChartLabels: Array<any> = ["", "", "", "", "", ""];
export var smallLineChartOptions: any = {
  scaleShowHorizontalLines: false,
  pointDotStrokeWidth: 0,
  scaleShowVerticalLines: false,
  responsive: true,
  backgroundColor: "transparent",
  borderColor: "#ff8084",
  pointColor: "#ff8084",
  elements: {
    point: {
      radius: 0
    },
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
    y: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
  }
};
export var smallLineChartLegend = false;
export var smallLineChartType = 'line';

//line chart
export var smallLine2ChartData: Array<any> = [
  { data: [85, 83, 90, 70, 85, 60, 65, 63, 68, 68, 65, 40, 60, 75, 70, 90] },
];
export var smallLine2ChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
export var smallLine2ChartOptions: any = {
  scaleShowHorizontalLines: false,
  pointDotStrokeWidth: 0,
  scaleShowVerticalLines: false,
  responsive: true,
  elements: {
    point: {
      radius: 0
    },
    line: {
      tension: 0
    }
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
    y: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
  }
};
export var smallLine2ChartLegend = false;
export var smallLine2ChartType = 'line';


//line chart
export var smallLine3ChartData: Array<any> = [
  { data: [85, 83, 90, 70, 85, 60, 65, 63, 68, 68, 65, 40, 60, 75, 70, 90] },
];
export var smallLine3ChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
export var smallLine3ChartOptions: any = {
  scaleShowHorizontalLines: false,
  pointDotStrokeWidth: 0,
  scaleShowVerticalLines: false,
  responsive: true,
  backgroundColor: "transparent",
  borderColor: "#f0b54d",
  pointColor: "#f0b54d",
  elements: {
    point: {
      radius: 0
    },
    line: {
      tension: 0
    }
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
    y: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
  }
};
export var smallLine3ChartLegend = false;
export var smallLine3ChartType = 'line';

//line chart
export var smallLine4ChartData: Array<any> = [
  { data: [85, 83, 90, 70, 85, 60, 65, 63, 68, 68, 65, 40, 60, 68, 75, 70, 90] },
];
export var smallLine4ChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
export var smallLine4ChartOptions: any = {
  scaleShowHorizontalLines: false,
  pointDotStrokeWidth: 0,
  scaleShowVerticalLines: false,
  responsive: true,
  backgroundColor: "transparent",
  borderColor: "#a5a5a5",
  pointColor: "#a5a5a5",
  pointStrokeColor: "#fff",
  pointHighlightFill: "#fff",
  pointHighlightStroke: "#000",
  elements: {
    point: {
      radius: 0
    },
    line: {
      tension: 0
    }
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
    y: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    },
  }
};
export var smallLine4ChartColors: Array<any> = [
  {
    backgroundColor: "transparent",
    borderColor: "#a5a5a5",
    pointColor: "#a5a5a5",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "#000",
  },

];
export var smallLine4ChartLegend = false;
export var smallLine4ChartType = 'line';


// Chart 3
export var chart3: Chart = {
  type: 'Bar',
  data: {
    labels: [],
    series: [[]]
    
  },
  options: {
    height: '100%',
    seriesBarDistance: 12,
    axisX: {
      showGrid: false,
      // labelInterpolationFnc: function (value) {
      //   return value[0];
      // }
    }
  },
  events: {
    created: (data) => {

    }
  }
};


//report component

//line chart
export var salesChartData: Array<any> = [
  { data: [10, 50, 0, 80, 10, 70] },
  { data: [20, 40, 15, 70, 30, 27] },
  { data: [5, 30, 20, 40, 50, 20] }
];
export var salesChartLabels: Array<any> = ["1 min.", "10 min.", "20 min.", "30 min.", "40 min.", "50 min."];
export var salesChartOptions: any = {
  scaleShowGridLines: true,
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      tension: 0.5
    }
  },
};
export var salesChartColors: Array<any> = [
  {
    backgroundColor: "transparent",
    borderColor: "#01cccd",
    pointColor: "#01cccd",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "#000"
  },
  {
    backgroundColor: "transparent",
    borderColor: "#a5a5a5",
    pointColor: "#a5a5a5",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#000",
    pointHighlightStroke: "rgba(30, 166, 236, 1)",
  },
  {
    backgroundColor: "transparent",
    borderColor: "#ff7f83",
    pointColor: "#ff7f83",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#000",
    pointHighlightStroke: "rgba(30, 166, 236, 1)",
  }
];
export var salesChartLegend = false;
export var salesChartType = 'line';

export var areaChart1: any = {
  chartType: 'AreaChart',
  dataTable: [
    ['Year', 'Sales', 'Expenses'],
    ['2013', 1000, 400],
    ['2014', 1170, 460],
    ['2015', 660, 1120],
    ['2016', 1030, 540]
  ],
  options: {
    title: 'Company Performance',
    hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
    width: '100%',
    height: 340,
    colors: ["#ff7f83", "#a5a5a5"],
    backgroundColor: 'transparent'
  },
};

export var columnChart1: any = {
  chartType: 'ColumnChart',
  dataTable: [
    ["Year", "Sales", "Expenses"],
    ["100", 2.5, 3.8],
    ["200", 3, 1.8],
    ["300", 3, 4.3],
    ["400", 0.9, 2.3],
    ["500", 1.3, 3.6],
    ["600", 1.8, 2.8],
    ["700", 3.8, 2.8],
    ["800", 1.5, 2.8]
  ],
  options: {
    legend: { position: 'none' },
    bars: "vertical",
    vAxis: {
      format: "decimal"
    },
    height: 340,
    width: '100%',
    colors: ["#ff7f83", "#a5a5a5"],
    backgroundColor: 'transparent'
  },
};

export var lineChart: any = {
  chartType: 'LineChart',
  dataTable: [
    ['Month', 'Guardians of the Galaxy', 'The Avengers'],
    [10, 20, 60],
    [20, 40, 10],
    [30, 20, 40],
    [40, 50, 30],
    [50, 20, 80],
    [60, 60, 30],
    [70, 10, 20],
    [80, 40, 90],
    [90, 20, 0]
  ],
  options: {
    colors: ["#ff8084", "#a5a5a5"],
    legend: { position: 'none' },
    height: 500,
    width: '100%',
    backgroundColor: 'transparent'
  },
};

export var chart6: Chart = {
  type: 'Line',
  data: {
    labels: [],
    series: [
      [3, 4, 3, 5, 4, 3, 5]
    ]
  },
  options: {
    showScale: false,
    fullWidth: !0,
    showArea: !0,
    label: false,
    width: '600',
    height: '358',
    low: 0,
    offset: 0,
    axisX: {
      showLabel: false,
      showGrid: false
    },
    axisY: {
      showLabel: false,
      showGrid: false,
      low: 0,
      offset: -10,
    },
  }
};
