<template>
  <div id="townInfo" style="display:none">
      {{ chosenAddress }} <br><br>
      <br><br>
      {{ currentData }} 정보!<br><br>
      <LineChart :passData='passData'/>
      <LineChart :passData='passData'/>
  </div>
</template>

<script>
import LineChart from './charts/LineChart'
import axios from 'axios';

export default {
    components: {
        LineChart
    },
    props: {
        currentData: String,
        chosenAddress: String
    },
    data() {
        return {
            passData: {}
        }
    },
    watch: {
        currentData: function(data) {
            this.getChartData(data)
        }
    },
    methods: {
        getChartData(val) {
            axios.post('http://localhost:9200/officetel-rent-data/_search', {
                "size": 0,
                "sort": {
                    "@timestamp": {
                    "order": "asc"
                    }
                },
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"전월세구분": "월세"}},
                            {"prefix": {"시군구": {"value": val}}}
                        ]
                    } 
                }, 
                "aggs": {
                    "result": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "calendar_interval": "year",
                        "format": "yyyy"
                    },
                    "aggs": {
                        "면적": {
                            "avg": {"field": "area"}},
                            "보증금": {"avg": {"field": "deposit"}},
                            "월세": {"avg": {"field": "rent"}},
                            "10평당 월세": {
                            "bucket_script": {
                                "buckets_path": {
                                "v1": "면적",
                                "v2": "월세"
                                },
                                "script": "params.v2 / params.v1 * 33"
                            }
                            },
                            "10평당 보증금": {
                            "bucket_script": {
                                "buckets_path": {
                                "v1": "면적",
                                "v2": "보증금"
                                },
                                "script": "params.v2 / params.v1 * 33"
                            }
                        }
                    }
                }
            }
            }).then(res => { 
                console.log();
                let labels = []
                let tempData1 = {data:[], label:'10평당 보증금'}
                let tempData2 = {data:[], label:'10평당 월세'}
                for (let data of res.data.aggregations.result.buckets){
                    labels.push(data.key_as_string)
                    tempData1['data'].push(data['10평당 보증금'].value)
                    tempData2['data'].push(data['10평당 월세'].value)
                }

                this.passData = {
                    labels: labels,
                    datasets: [tempData1, tempData2]
                }
            })
        }
    },
}
</script>