<script setup>
import { ref, onMounted } from 'vue'
import Board from './components/Board.vue'
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'

const tags = ref([])
const columns = ref([])
const modalRef = ref(null)

const title = 'My Kanban Board'

/**
 * Calls the showModal() function in Modal.vue, assuming the component is registered and referenced.
 * DO NOT MODIFY.
 */
function showModal(task = null, columnId = null) {
    if (modalRef.value) {
        modalRef.value.showModal(task, columnId)
    }
}

/**
 * Calls showModal() in editing mode.
 * DO NOT MODIFY.
 * @param taskId
 */
function triggerEdit(taskId) {
    for (let column of columns.value) {
        const index = column.tasks.findIndex(t => t.id === taskId)
        if (index > -1) {
            const task = column.tasks[index]
            showModal(task)
            return
        }
    }
}

////////////////////////////////////////////////////////////////
// API calls below, only modify the content of the functions, not their signature! //
////////////////////////////////////////////////////////////////

async function loadTags() {
    //TODO: implement (see 6.2 / 6.1.4)
    fetch('/api/tags')
    .then(res => res.json())
    .then(res => tags.value = res)
    .catch(() => console.error("Fehler"));
}

async function loadColumns() {
    //TODO: implement (see 6.2 / 6.1.5)
    fetch('/api/columns')
    .then(res => res.json())
    .then(res => columns.value = res)
    .catch(() => console.error("Fehler"));
}

async function createTask(columnId, taskTitle, taskText, taskTags) {
    //TODO: implement (see 6.2 / 6.1.6)
    fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "column": columnId,
            "title": taskTitle,
            "text": taskText,
            "taskTags": taskTags
        })
    })
    .then(res => res.json())
    .then(res => console.log(`Task ${res} erfolgreich angelegt`))
    .then(() => loadColumns())
    .catch(() => console.error("Fehler"));
}

async function editTask(taskId, taskTitle, taskText, taskTags) {
    //TODO: implement (see 6.2 / 6.1.7)
    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "title": taskTitle,
            "text": taskText,
            "taskTags": taskTags
        })
    })
    .then(res => console.log(res))
    .then(() => loadColumns())
    .catch(error => console.error(error));
}

async function deleteTask(taskId) {
    //TODO: implement (see 6.2 / 6.1.8)
    fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => console.log(res))
    .then(() => loadColumns())
    .catch(error => console.error(error));
}

async function moveTask(taskId, newColumnId) {
    //TODO: implement (see 6.2 / 6.1.9)
    fetch(`/api/move-task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "newColumnId": newColumnId
        })
    })
    .then(res => console.log(res))
    .then(() => loadColumns())
    .catch(error => console.error(error));
}

onMounted(() => {
    // DO NOT MODIFY
    loadTags()
    loadColumns()
})
</script>

<template>
    <!-- DO NOT MODIFY -->
    <Header :title="title" @show-modal="showModal" />
    <Board :columns="columns" @move-task="moveTask" @trigger-edit="triggerEdit" @delete-task="deleteTask"/>
    <Modal :tags="tags" :columns="columns" ref="modalRef" @create-task="createTask" @edit-task="editTask"/>
</template>