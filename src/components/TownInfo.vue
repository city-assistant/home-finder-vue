<template>
  <div id="townInfo" style="display:none">
      <LineChart/>
      {{ currentData }} <br>
      여기에 동네 정보를 표기할 수 있을 것 같습니다
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
    },
    watch: {
        currentData: function(val) {
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
                        {"prefix": {"시군구": {"value": "서울특별시 강서구 마곡동"}}}
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
                    "avg": {
                        "field": "area"
                    }
                    },
                    "보증금": {
                    "avg": {
                        "field": "deposit"
                    }
                    },
                    "월세": {
                    "avg": {
                        "field": "rent"
                    }
                    },
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
                console.log(res.data.aggregations.result.buckets)
            })
            console.log(val);
        }
    }
}
</script>