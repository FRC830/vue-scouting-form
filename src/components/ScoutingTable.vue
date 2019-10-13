<template>
    <table class="table">
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
    </table>
</template>
<script>
export default {
    data: function () {
        return {
            data: []
        }
    },
    mounted () {
        this.setData()
    },
    methods: {
        setData () {
            this.axios.get('/api/get/scouting.csv')
            .then(res => { this.data = res.data })
            .catch(err => { throw err })
        }
    },
    name: 'ScoutingTable'
}
</script>
