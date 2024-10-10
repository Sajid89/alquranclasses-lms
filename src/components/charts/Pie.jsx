import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, PieSeries, AccumulationDataLabel, Inject } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';



const Pie = ({attendanceData}) => {
    let data1 = [
        { x: 'Attended', y: attendanceData.attended, text: `Attended: ${attendanceData.attended}` },
        { x: 'Absent', y: attendanceData.absent, text: `Absent: ${attendanceData.absent}` },
        { x: 'Declined', y: attendanceData.declined, text: `Declined: ${attendanceData.declined}` },
        { x: 'Cancelled', y: attendanceData.cancelled, text: `Cancelled: ${attendanceData.cancelled}` },
        { x: 'Makeup', y: attendanceData.makeup, text: `Makeup: ${attendanceData.makeup}` }
    ];
    
    const onChartLoad = (args) => {
        document.getElementById('pie-chart').setAttribute('title', '');
    };

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <AccumulationChartComponent 
                    id="pie-chart" 
                    width='98%'
                    centerLabel={{ text: 'Mobile<br>Browsers<br>Statistics', textStyle: { fontWeight: '600', size: Browser.isDevice ? '7px' : '15px' } }} 
                    enableSmartLabels={true} 
                    loaded={onChartLoad} 
                    legendSettings={{ visible: false }}
                >
                    <Inject services={[PieSeries, AccumulationDataLabel]} />
                    <AccumulationSeriesCollectionDirective>
                        <AccumulationSeriesDirective dataSource={data1} xName='x' yName='y' innerRadius='65%' 
                            dataLabel={{ visible: true, position: 'Outside', name: 'text', font: { fontWeight: '600' } }} 
                            radius= {Browser.isDevice ? '40%' : '70%'} />
                    </AccumulationSeriesCollectionDirective>
                </AccumulationChartComponent>
            </div>
        </div>
    );
}

export default Pie;