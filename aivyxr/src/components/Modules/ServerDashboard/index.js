import './serverDashboard.css';

import Card from './../../Card';
import DashboardController from './DashboardController';
import { useRef } from 'react';


export default function ServerDashboard({Client}){
    const ClientRef = useRef(Client);

    return (
        <div className="App-modules-server-dashboard full">
            <div className="dashboard-controls full">
                <Card
                    title="Controller"
                    height="100%"
                    text={<DashboardController Client={ClientRef.current}></DashboardController>}>
                </Card>
            </div>
            <div className="dashboard-infos full">
                <Card
                    title="Informations"
                    height="100%">
                </Card>
            </div>
            <div className="dashboard-stats full">
                <Card
                    title="Stats"
                    height="100%">
                </Card>
            </div>
        </div>
    );
}