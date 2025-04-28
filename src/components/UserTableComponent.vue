<template>
    <div v-if="submittedData.length" class="mt-5">
        <h3>Submitted Data</h3>
        <table class="table table-bordered mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Groups</th>
              <th>Birth Date</th>
              <th>Gender</th>
              <th>Languages</th>
              <th>Cities</th>
              <th>File Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, idx) in submittedData" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>
                <div v-for="(g, gidx) in data.groups" :key="gidx">
                  {{ g.name }} | {{ g.email }} | {{ g.mobile }}
                </div>
              </td>
              <td>{{ data.birthDate }}</td>
              <td>{{ data.gender }}</td>
              <td>{{ data.languages.join(', ') }}</td>
              <td>{{ data.cities.join(', ') }}</td>
              <td>{{ data.fileName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
</template>
<script setup>
//Define props
const props = defineProps({
    submittedData: Array
})
</script>