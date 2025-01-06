import fs from 'fs';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';

// health STATUS check
async function getHealthStatus(req, res) {
    try {
        if (process.env.ENVIRONMENT === 'PROD') {
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
        if (process.env.ENVIRONMENT === 'PROD') {
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
            const parsedMetrics = dataManipulation(parsePrometheusTextFormat(metricsData));
            return res.status(200).json(parsedMetrics);

        } else {
            // Development environment response with error handling
            try {
                const metricsStr = fs.readFileSync('./sample-files/metrics.txt', 'utf8');
                const parsed = dataManipulation(parsePrometheusTextFormat(metricsStr));
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
    return data;
}


export {
    getMetricsController,
    getHealthStatus
}