import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useContext,useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const GenerateReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate("");

    useEffect(() => {
    if(!state) {
        navigate("/Login")
    }

    }, [state])

    const parseData = (data) => {
        return data.map(item => ({
          FullName: item.userId.fullName,
          VehicleName: item.vehicleId.name,
          VehicleType: item.vehicleId.vehicleType,
          VinNumber: item.vehicleId.vinNumber,
          StartTime: item.startTime,
          StartDate: item.startDate,
          EndTime: item.endTime,
          EndDate: item.endDate
        }));
      };

    const handleDownloadReport =async () => {
        try {
            // Use Axios to send a GET request with fromDate and toDate as query parameters
            const response = await axios.post('http://localhost:6001/user/generate_report', {
                    startDate,
                    endDate
                },
                {
                    withCredentials: true
                });

            if(!response.status == 200) {
                alert("Error occurred")
                return;
            }

            
                const data = response.data

                if(data.length == 0) {
                    alert("No Data to generate report")
                    return
                }
                const parsedData = parseData(data);
                const worksheet = XLSX.utils.json_to_sheet(parsedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
                
                // Create a binary string representation of the workbook
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

                // Convert string to ArrayBuffer
                const buf = new ArrayBuffer(wbout.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < wbout.length; i++) {
                view[i] = wbout.charCodeAt(i) & 0xFF;
                }

                // Save the file
                saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'Report.xlsx');
            
        }
        catch(error) {
            console.error('Error downloading the report:', error);
            alert('There was an error downloading the report.');
        }
        

    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Download Report</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="fromDate" className="form-label">From Date</label>
                            <input 
                                type="date"
                                className="form-control"
                                id="fromDate"
                                value={startDate} 
                                max={today}
                                onChange={e => setStartDate(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="toDate" className="form-label">To Date</label>
                            <input 
                                type="date"
                                className="form-control"
                                id="toDate"
                                max={today} // Set the max attribute to today's date
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)} 
                            />
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-primary text-center"
                            onClick={handleDownloadReport}
                        >
                            Download Report
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenerateReport;
