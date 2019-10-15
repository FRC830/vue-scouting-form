<template>
    <ag-grid-vue
    class="ag-theme-balham"
    :columnDefs="columns"
    :rowData="rows"
    @grid-ready="onGridReady">
    </ag-grid-vue>
    <!-- <table class="table">
        <thead>
            <tr>
                <th scope="col">index</th>
                <th scope="col" v-for="(_, key) in data[0]" v-bind:key="key"> {{ key }} </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, index) in data" :key="row">
                <th scope="row"> {{ index }} </th>
                <td v-for="(val, idx) in row" v-bind:key="idx"> {{ val }} </td>
            </tr>
        </tbody>
    </table> -->
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
    data: function () {
        return {
            columns: null,
            rows: null,
            gridApi: null
        }
    },
    mounted () {
        this.setData()
    },
    methods: {
        setData () {
            this.axios.get('/api/get/scouting.csv')
            .then(res => {
                let data = res.data
                let cols = [{ headerName: 'ID', valueGetter: 'node.id', resizable: true }]
                let sampleRow = data[0]
                for (var key in sampleRow) {
                    let filter = 'agTextColumnFilter'
                    if (!isNaN(sampleRow[key])) {
                        filter = 'agNumberColumnFilter'
                    }
                    cols.push({ headerName: key.capitalize(),
                    field: key,
                    sortable: true,
                    filter: filter,
                    resizable: true })
                }
                this.columns = cols
                this.rows = data
            })
            .catch(err => { throw err })
        },
        onGridReady (params) {
            this.gridApi = params.api
            this.columnApi = params.columnApi
            this.gridApi.setDomLayout('autoHeight')
            // this.gridApi.expandAll()
            // this.gridApi.sizeColumnsToFit()
            this.columnApi.autoSizeColumns()
        }
    },
    components: {
        AgGridVue
    },
    name: 'ScoutingTable'
}
</script>
<style lang="scss">
* {
    box-sizing: border-box;
}
</style>
