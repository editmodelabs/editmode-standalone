import {domReady, api} from './utils'
import Component from "./components"

const EditmodeStandAlone = {
  projectId: null,

  // Initialize
  start: async function () {
    await domReady()

    this.discoverChunks(el => {
      this.getChunk(el)
    })

    this.discoverCollections(el => {
      this.getCollection(el)
    })

    this.addMagicEditorPlugin()
    window.chunksProjectIdentifier = this.projectId
  },

  // Scan DOM Search for tags with chunk-id attr
  discoverChunks: function(callback) {
    const chunkElements = document.querySelectorAll('[chunk-id]');

    chunkElements.forEach(el => {
      callback(el)
    })
  },

  // Get chunk data from Editmode API
  getChunk: function(el) {
    const chunkId = el.getAttribute('chunk-id')
    const chunkProjectId = el.getAttribute('project-id')

    api
      .get(`/chunks/${chunkId}?project_id=${chunkProjectId || this.projectId}`)
      .then(res => {
        const chunk = res.data

        // Todo: Transfer to renderChunk
        Component.renderChunk(el, chunk)
      })
  },

  // Scan DOM Search for collection tags
  discoverCollections: function(callback) {
    const collectionElements = document.querySelectorAll('collection')

    collectionElements.forEach(el => {
      callback(el)
    })
  },

   // Get collection data from Editmode API
  getCollection: function(el) {
    const collectionId = el.getAttribute('collection-id')
    const chunkProjectId = el.getAttribute('project-id')
    const urlParams = new URLSearchParams({
      collection_identifier: collectionId,
    });

    api.get(`/chunks/?${urlParams}&projectId=${chunkProjectId || this.projectId}&`).then(res => {
      const chunks = res.data.chunks

      Component.renderCollection(el, chunks)
    })
  },

  addMagicEditorPlugin: function() {
    var s = document.createElement('script')
    s.setAttribute('src', "https://static.editmode.com/editmode@^2.0.0/dist/editmode.js")
    s.async = true

    document.body.appendChild( s )
  }
}


window.EditmodeStandAlone = EditmodeStandAlone
window.EditmodeStandAlone.start()