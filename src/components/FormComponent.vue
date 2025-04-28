<template>
    <div class="container my-5">
        <form @submit.prevent="submitForm" class="row g-3">

            <!-- Dynamic Groups Section -->
            <div v-for="(group, index) in postData.groups" :key="index"
                class="col-12 border p-4 rounded bg-light position-relative">
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Name</label>
                        <input v-model="group.name" type="text" class="form-control" placeholder="Name" />
                        <div v-if="groupErrors[index]?.name && !group.name" class="text-danger">{{
                            groupErrors[index].name }}</div>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Email</label>
                        <input v-model="group.email" type="email" class="form-control" placeholder="Email" />
                        <div v-if="groupErrors[index]?.email && !group.email" class="text-danger">{{
                            groupErrors[index].email }}</div>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Mobile Number</label>
                        <input v-maska="'(###) ###-####'" v-model="group.mobile" type="text" class="form-control"
                            placeholder="(000) 000-0000" />
                        <div v-if="groupErrors[index]?.mobile && !group.mobile" class="text-danger">{{
                            groupErrors[index].mobile }}</div>
                    </div>
                </div>

                <button v-if="postData.groups.length > 2" type="button" @click="removeGroup(index)"
                    class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">Remove</button>
            </div>
            <!-- End Dynamic Group Section  -->
            <div class="col-12">
                <button type="button" @click="addGroup" class="btn btn-success">+ Add More</button>
            </div>

            <!-- Static Fields -->
            <div class="col-md-4">
                <label class="form-label">Birth Date</label>
                <VueDatePicker v-model="postData.birthDate" placeholder="Select Date" :enable-time-picker="false"
                    auto-apply />
                <div v-if="v$?.birthDate?.$error" class="text-danger">{{ v$.birthDate.required.$message }}</div>
            </div>

            <div class="col-md-4">
                <label class="form-label d-block">Gender</label>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="Male" v-model="postData.gender" id="male" />
                    <label class="form-check-label" for="male">Male</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="Female" v-model="postData.gender" id="female" />
                    <label class="form-check-label" for="female">Female</label>
                </div>
                <div v-if="v$?.gender?.$error" class="text-danger">{{ v$.gender.required.$message }}</div>
            </div>

            <div class="col-md-4">
                <label class="form-label d-block">Languages</label>
                <div class="form-check form-check-inline" v-for="lang in ['Angular', 'VueJs', 'ReactJs']" :key="lang">
                    <input class="form-check-input" type="checkbox" :value="lang" v-model="postData.languages"
                        :id="lang" />
                    <label class="form-check-label" :for="lang">{{ lang }}</label>
                </div>
                <div v-if="v$?.languages?.$error" class="text-danger">{{ v$.languages.required.$message }}</div>
            </div>

            <div class="col-md-6">
                <label class="form-label">City</label>
                <Multiselect v-model="postData.cities" :options="cityOptions" :multiple="true"
                    placeholder="Select cities" />
                <div v-if="v$?.cities?.$error" class="text-danger">{{ v$.cities.required.$message }}</div>
            </div>

            <div class="col-md-6">
                <label class="form-label">File Upload (JPEG/PDF only)</label>
                <input type="file" @change="handleFileUpload" class="form-control" />
                <div v-if="filePreview" class="mt-3">
                    <h6>Image Preview:</h6>
                    <img :src="filePreview" alt="Preview" class="img-thumbnail" style="max-width: 300px;">
                </div>
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
        <UserTableComponent :submittedData="submittedData" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import Multiselect from 'vue-multiselect';
import UserTableComponent from './UserTableComponent.vue';
import { toast } from 'vue3-toastify';
import axios from 'axios';;

// Define refs and constants 
const postData = reactive({
    groups: [
        { name: '', email: '', mobile: '' },
        { name: '', email: '', mobile: '' }
    ],
    birthDate: '',
    gender: '',
    languages: [],
    cities: [],
    file: null
})

const cityOptions = ['Thane', 'Indore', 'Bhopal', 'Guwahati', 'Surat', 'Lucknow', 'Visakhapatnam', 'Nagpur', 'Amritsar', 'Mysuru']

const filePreview = ref(null)
const submittedData = ref([])

const groupErrors = ref([])

// Vuelidate Rules
const rules = computed(() => ({
    birthDate: { required: helpers.withMessage('Please select Birth Date', required) },
    gender: { required: helpers.withMessage('Please select Gender', required) },
    languages: { required: helpers.withMessage('Please select at least one Language', required) },
    cities: { required: helpers.withMessage('Please select at least one City', required) }
}))

const v$ = useVuelidate(rules, postData)

// Functions to add group
const addGroup = () => {
    postData.groups.push({ name: '', email: '', mobile: '' })
}

// Functions to remove group
const removeGroup = (index) => {
    if (postData.groups.length > 2) {
        postData.groups.splice(index, 1)
        groupErrors.value.splice(index, 1)
    }
}

//Function to validate the group data
const validateGroups = () => {
    groupErrors.value = []

    postData.groups.forEach((group) => {
        const error = {}
        if (!group.name.trim()) error.name = 'Name is required'
        if (!group.email.trim()) error.email = 'Email is required'
        if (!group.mobile.trim()) error.mobile = 'Mobile Number is required'

        groupErrors.value.push(error)
    })

    return groupErrors.value.every(err => Object.keys(err).length === 0)
}

//Function to handle the file upload
const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    const fileInput = event.target // This is the file input element

    if (!uploadedFile) return

    // Check if file is valid (JPEG or PDF)
    if (uploadedFile.type === 'application/pdf' || uploadedFile.type.startsWith('image/jpeg')) {
        postData.file = uploadedFile  // Store the valid file

        // If the file is an image (JPEG), create a preview URL
        if (uploadedFile.type.startsWith('image/jpeg')) {
            filePreview.value = URL.createObjectURL(uploadedFile)
        } else {
            filePreview.value = null  // If it's a PDF, reset the preview
        }
    } else {
        // Show error toast and reset values for invalid file type
        toast.error('Only JPEG and PDF files are allowed.')

        // Reset file input and file preview
        postData.file = null
        filePreview.value = null

        // Reset the file input element itself to clear the displayed file name
        fileInput.value = ''  // This will clear the file input box name
    }
}

//Function to handle the api
const callSaveApi = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
            'https://api-endpoint',
            {
                ...postData,
                fileName: postData.file ? postData.file.name : ''
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            submittedData.value.push(response.data);
            toast.success('Form submitted successfully!');
        } else {
            toast.error('Something went wrong, please try again!');
        }
    } catch (error) {
        console.error(error);
        toast.error('Failed to submit form. Please check the details and try again.');
    }

}

//Function to handle the submit data
const submitForm = async () => {
    const isValidVuelidate = await v$.value.$validate()
    const isValidGroups = validateGroups()

    if (!isValidVuelidate || !isValidGroups) {
        return
    }

    submittedData.value.push({
        ...postData,
        fileName: postData.file ? postData.file.name : ''
    })
    //For now I don't have any api therefore I am commeting this function
    // callSaveApi();

    // Save to localStorage
    localStorage.setItem('submittedData', JSON.stringify(submittedData.value))

    // Reset form
    postData = {
        groups: [
            { name: '', email: '', mobile: '' },
            { name: '', email: '', mobile: '' }
        ],
        birthDate: '',
        gender: '',
        languages: [],
        cities: [],
        file: null
    }
    groupErrors.value = []
    filePreview.value = null
    toast.success('Form submitted successfully!')
}

//Lifecycle hooks
// Load data from localStorage on page load
onMounted(() => {
    const savedData = localStorage.getItem('submittedData')
    if (savedData) {
        submittedData.value = JSON.parse(savedData)
    }
})

</script>
