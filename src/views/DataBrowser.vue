<template>
    <div id="data-viewer">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">index</th>
                    <th scope="col" v-for="(_, key) in file[0]" :key=key> {{ key }} </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in file" :key="row">
                    <th scope="row"> {{ index }} </th>
                    <td v-for="val in row" :key=val> {{ val }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import ScoutingJSON from '../../data/scouting.json'
    export default {
        data: function () {
            return {
                file: ScoutingJSON
            }
        }
    }
</script>
