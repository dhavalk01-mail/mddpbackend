import axios from 'axios';
import fs from 'fs';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';

// health STATUS check
async function getHealthStatus(req, res) {
    try {
        if (process.env.ENVIRONMENT !== 'DEV') {
            // Validate URL parameter also validate URL value
            const url = req.query.url;
            if (!url || !url.startsWith("http")) {
                return res.status(400).json({
                    status: "ERROR",
                    error: !url ? "URL parameter is required" : "Invalid URL"
                });
            }

            // Get health data from URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const healthData = await response.json();

            return res.status(200).json(healthData);

        } else {
            // Development environment response
            return res.status(200).json({
                status: "UP",
                components: {
                    diskSpace: {
                        status: "UP",
                        details: {
                            total: 80527486976,
                            free: 18491420672,
                            threshold: 10485760099,
                            path: "C:\\Users\\nagaraju\\Documents\\workspace-spring-tool-suite-4-4.24.0.RELEASE\\Metricmgmt\\.",
                            exists: true
                        }
                    },
                    ping: {
                        status: "UP"
                    }
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "UNAVAILABLE",
            error: error.message
        });
    }
}

async function getMetricsController(req, res) {
    try {
        if (process.env.ENVIRONMENT !== 'DEV') {
            // Validate URL parameter also validate URL value
            const url = req.query.url;
            if (!url || !url.startsWith("http")) {
                return res.status(400).json({
                    status: "ERROR",
                    error: !url ? "URL parameter is required" : "Invalid URL"
                });
            }

            // Get metrics data from URL using async/await
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const metricsData = await response.text();
            const parsedMetrics = parsePrometheusTextFormat(dataManipulation(metricsData));
            return res.status(200).json(parsedMetrics);

        } else {
            // Development environment response with error handling
            try {
                const metricsStr = fs.readFileSync('./sample-files/metrics.txt', 'utf8');
                const parsed = parsePrometheusTextFormat(dataManipulation(metricsStr));
                return res.status(200).json(parsed);
            } catch (err) {
                throw new Error(`Failed to read metrics file: ${err.message}`);
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: "UNAVAILABLE",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

function dataManipulation(data) {
    const removestring = ['tomcat_sessions_created_sessions_total', 'tomcat_sessions_expired_sessions_total', 'tomcat_sessions_alive_max_seconds', 'tomcat_sessions_active_current_sessions', 'tomcat_sessions_active_max_sessions', 'tomcat_sessions_rejected_sessions_total', 'http_server_requests_seconds'];

    let dataArray = data.split('\n');
    let removelines = dataArray.filter(line => removestring.some(remove => line.includes(remove)));
    let finaldata = dataArray.filter(line => !removelines.includes(line));
    
    finaldata = finaldata.join('\n');
    return finaldata;
}

/*
async function getGrafanaURL(req, res) {

    // Validate URL parameter also validate URL value
    const targetUrl = req.query.url;
    if (!targetUrl || !targetUrl.startsWith("http")) {
        return res.status(400).json({
            status: "ERROR", 
            error: !targetUrl ? "URL parameter is required" : "Invalid URL"
        });
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({
            status: "UNAVAILABLE",
            error: err.message
        });
    }
}
*/

async function getGrafanaURL(req, res) {

    // Validate URL parameter also validate URL value
    const targetUrl = req.query.url;
    // const targetUrl = 'http://10.63.34.245:3000/dashboard/snapshot/avF9ZBlUUXeunQ84NQwx8AXFSJa2zE0o?kiosk';
    if (!targetUrl || !targetUrl.startsWith("http")) {
        return res.status(400).json({
            status: "ERROR",
            error: !targetUrl ? "URL parameter is required" : "Invalid URL"
        });
    }

    /*
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        console.log(data);
        
        res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({
            status: "UNAVAILABLE",
            error: err.message
        });
    }
    */

    if (!targetUrl) {
        return res.status(400).send('Error: "url" query parameter is required.');
    }

    try {
        const response = await axios.get(targetUrl, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (error) {
        console.error(`Error fetching the target URL: ${error.message}`);
        res.status(500).send('Error fetching the target URL.');
    }

}

export {
    getMetricsController,
    getHealthStatus,
    getGrafanaURL
}