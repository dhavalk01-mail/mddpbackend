import fs from 'fs';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';

function parsePrometheusRaWTextFormat(text) {
    const parsedData = parsePrometheusTextFormat(text);
    const metrics = {};

    parsedData.forEach(metric => {
        const metricName = metric.name;
        const metricHelp = metric.help;
        const metricType = metric.type;

        const metricValues = {};

        metric.metrics.forEach(metricValue => {
            const labels = metricValue.labels || {};
            const value = metricValue.value;

            const labelKey = Object.values(labels).join('_');
            metricValues[labelKey] = value;
        });

        metrics[metricName] = {
            help: metricHelp,
            type: metricType,
            values: metricValues
        };
    });

    return metrics;
}

export default function getMetricsController(req, res) {
    const metricsStr = fs.readFileSync('./metrics.txt', 'utf8');
    const parsed = parsePrometheusTextFormat(metricsStr);
    res.json(parsed).status(200);
}