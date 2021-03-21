import { domReady, api, getCachedData, storeCache, setBranchId } from './utils'
import Component from "./components"

const EditmodeStandAlone = {
  projectId: null,
  branchId: setBranchId(),
  defaultChunks: [],

  // Initialize
  start: async function () {
    console.log('Discovering contents...')

    await domReady() 

    this.discoverContents()
    this.addMagicEditorPlugin()

    window.chunksProjectIdentifier = this.projectId
  },

  discoverContents: function() {
    this.discoverChunks(el => {
      this.getChunk(el)
    })

    this.discoverCollections(el => {
      this.getCollection(el)
    })
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
    const cacheid = chunkId + this.projectId + this.branchId
    const cacheData = getCachedData(cacheid)
    
    if (cacheData) {
      console.log('%c Rendering from cache: ' + chunkId, 'color: #bada55');
      Component.renderChunk(el, cacheData)
    }

    api(`/chunks/${chunkId}`, 
      { 
        parameters: { 
          project_id: chunkProjectId || this.projectId,
          branch_id: this.branchId
        }
      }
    ).then(chunk => {
      storeCache(cacheid, chunk)

      // If no cache data, render content from API
      if (!cacheData) {
        Component.renderChunk(el, chunk)
      }
    })
  },

  // Scan DOM Search for collection tags
  discoverCollections: function(callback) {
    const collectionElements = document.querySelectorAll('template[collection-id]')

    collectionElements.forEach(el => {
      callback(el)
    })
  },

   // Get collection data from Editmode API
  getCollection: function(el) {
    const collectionId = el.getAttribute('collection-id')
    const chunkProjectId = el.getAttribute('project-id')
    const limit = el.getAttribute('limit')
    let tags = el.getAttribute('tags') || ""
    tags = tags.split(" ").filter(Boolean) // Filter boolean will remove empty strings

    const cacheid = collectionId + this.projectId + this.branchId + tags.join("")
    const cacheData = getCachedData(cacheid)

    console.log(tags)

    if (cacheData) {
      console.log('%c Rendering from cache: ' + collectionId, 'color: #bada55');
      Component.renderCollection(el, cacheData, limit)
    }

    api("/chunks/", 
      {
        parameters: {
          collection_identifier: collectionId,
          project_id: chunkProjectId || this.projectId,
          branch_id: this.branchId,
          tags: tags
        }
      }).then(res => {
        let chunks = res.chunks
        storeCache(cacheid, chunks)

        if (!cacheData) {
          Component.renderCollection(el, chunks, limit)
        }
      })
  },

  // Add magic editor plugin script tag before closing body tag
  addMagicEditorPlugin: function() {
    var s = document.createElement('script')
    s.setAttribute('src', "https://static.editmode.com/editmode@^2.0.0/dist/editmode.js")
    s.async = true

    document.body.appendChild( s )
  }
}


window.EditmodeStandAlone = EditmodeStandAlone
window.EditmodeStandAlone.start()

export default EditmodeStandAlone
