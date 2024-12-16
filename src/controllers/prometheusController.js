import fs from 'fs';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';

export default function getMetricsController(req, res) {
    const metricsStr = fs.readFileSync('./metrics.txt', 'utf8');
    const parsed = parsePrometheusTextFormat(metricsStr);
    if (req.query.data == 1) {
        dataManipulation(parsed);
    }
    res.json(parsed).status(200);
}

function dataManipulation(data) {
    return data;
}