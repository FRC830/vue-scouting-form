<template>
    <ag-grid-vue class="ag-theme-balham" :gridOptions="gridOptions" :columnDefs="columns" :rowData="rows" @cellValueChanged="onCellValueChanged" @rowDataChanged="onRowDataChanged"></ag-grid-vue>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
    data () {
        return {
            rows: null,
            columns: null,
            gridOptions: null
        }
    },
    created () {
        this.gridOptions = {
            floatingFilter: true,
            defaultColDef: {
                editable: true,
                sortable: true,
                resizable: true
            },
            animateRows: true
        }
        this.loadCSV()
    },
    methods: {
        loadCSV () {
            this.axios.get('/api/file/scouting.csv')
            .then(res => {
                let data = res.data
                let cols = [{ headerName: 'ID', valueGetter: 'node.id', editable: false }]
                let sampleRow = data[0]
                for (var key in sampleRow) {
                    let filter = 'agTextColumnFilter'
                    if (!isNaN(sampleRow[key])) {
                        filter = 'agNumberColumnFilter'
                    }
                    cols.push({ headerName: key.capitalize(), field: key, filter: filter })
                }
                this.columns = cols
                this.rows = data
            })
            .catch(err => { this.$emit('message', 'error', err.response.data.error) })
        },
        onRowDataChanged () {
            // wait for a DOM update, like setting rows to trigger column resize
            console.log('yes')
            this.gridOptions.floatingFilter = true
            this.$nextTick(() => {
                    this.gridOptions.api.setDomLayout('autoHeight')
                    this.gridOptions.api.sizeColumnsToFit()
                }
            )
        },
        onCellValueChanged () {
            let params = {
                columnKeys: this.gridOptions.columnApi.getAllColumns().slice(1),
                allColumns: false
            }
            console.log(params)
            let table = this.gridOptions.api.getDataAsCsv(params)
            console.log(table)
            this.axios.post('/api/file/scouting.csv', { params: { 'rawData': true }, data: table }).then(res => {
                this.$emit('message', 'success', res.data.success)
            }).catch(err => {
                console.log(err)
            })
        }
    },
    components: {
        AgGridVue
    },
    name: 'ScoutingTable'
}
</script>
