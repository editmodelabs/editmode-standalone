import { 
  domReady, api, getCachedData, storeCache,
  setBranchId, logger, getTimedCachedData, storeTimedCache
} from './utils'
import Component from "./components"

const EditmodeStandAlone = {
  projectId: null,
  branchId: setBranchId(),
  defaultChunks: [],

  // Initialize
  start: async function () {
    console.log('Discovering contents...')

    await domReady() 

    this.attachWatermark()
    this.discoverContents()
    this.addMagicEditorPlugin()

    window.chunksProjectIdentifier = this.projectId
  },

  attachWatermark: function() {
    const div = document.createElement('div')
    div.innerHTML = `<div style="z-index: 9999; bottom: 8px; right: 8px; position: fixed; opacity: 1; display: flex; align-items: center; background: rgba(255, 255, 255, 0.9); cursor: pointer; border-radius: 5px; padding: 2px 5px 2px 2px; box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;"><svg width="20" height="27" style="margin-right: 5px;"  viewBox="0 0 57 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.47575 11.9681C4.47575 11.9681 22.7685 1.26837 24.5608 0.266941C26.3531 -0.734485 27.9296 1.26837 27.9296 3.17864C27.9296 5.08891 27.9296 21.2701 27.9296 26.1723C27.9296 31.0745 27.3481 31.0745 25.4907 32.3321C23.6332 33.5898 4.35396 44.8099 3.29458 45.3859C2.23519 45.9619 0 45.1025 0 42.5066C0 39.9107 0 23.0363 0 18.6204C0 14.2045 4.47575 11.9681 4.47575 11.9681Z" fill="#203260"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="46">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.47575 11.9681C4.47575 11.9681 22.7685 1.26837 24.5608 0.266941C26.3531 -0.734485 27.9296 1.26837 27.9296 3.17864C27.9296 5.08891 27.9296 21.2701 27.9296 26.1723C27.9296 31.0745 27.3481 31.0745 25.4907 32.3321C23.6332 33.5898 4.35396 44.8099 3.29458 45.3859C2.23519 45.9619 0 45.1025 0 42.5066C0 39.9107 0 23.0363 0 18.6204C0 14.2045 4.47575 11.9681 4.47575 11.9681Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.76054 22.4622C7.76054 22.4622 26.0533 11.7625 27.8456 10.7611C29.6379 9.75966 31.2144 11.7625 31.2144 13.6728C31.2144 15.583 31.2144 31.7643 31.2144 36.6664C31.2144 41.5686 30.6329 41.5686 28.7755 42.8263C26.918 44.084 7.63875 55.304 6.57937 55.88C5.51998 56.456 3.28479 55.5966 3.28479 53.0007C3.28479 50.4048 3.28479 33.5304 3.28479 29.1145C3.28479 24.6986 7.76054 22.4622 7.76054 22.4622Z" fill="#000719"/>
    </g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4527 20.7957C18.4527 20.7957 36.7455 10.0959 38.5378 9.09452C40.3301 8.09309 41.9066 10.0959 41.9066 12.0062C41.9066 13.9165 41.9066 30.0977 41.9066 34.9999C41.9066 39.902 41.3251 39.902 39.4677 41.1597C37.6102 42.4174 18.331 53.6374 17.2716 54.2135C16.2122 54.7895 13.977 53.9301 13.977 51.3341C13.977 48.7382 13.977 31.8638 13.977 27.448C13.977 23.0321 18.4527 20.7957 18.4527 20.7957Z" fill="#223464"/>
    <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="13" y="8" width="29" height="47">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4527 20.7957C18.4527 20.7957 36.7455 10.0959 38.5378 9.09452C40.3301 8.09309 41.9066 10.0959 41.9066 12.0062C41.9066 13.9165 41.9066 30.0977 41.9066 34.9999C41.9066 39.902 41.3251 39.902 39.4677 41.1597C37.6102 42.4174 18.331 53.6374 17.2716 54.2135C16.2122 54.7895 13.977 53.9301 13.977 51.3341C13.977 48.7382 13.977 31.8638 13.977 27.448C13.977 23.0321 18.4527 20.7957 18.4527 20.7957Z" fill="white"/>
    </mask>
    <g mask="url(#mask1)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.3409 31.4244C22.3409 31.4244 40.6337 20.7246 42.426 19.7232C44.2183 18.7218 45.7947 20.7246 45.7947 22.6349C45.7947 24.5452 45.7947 40.7264 45.7947 45.6286C45.7947 50.5307 45.2132 50.5307 43.3558 51.7884C41.4984 53.0461 22.2191 64.2661 21.1597 64.8422C20.1003 65.4182 17.8651 64.5587 17.8651 61.9628C17.8651 59.3669 17.8651 42.4925 17.8651 38.0767C17.8651 33.6608 22.3409 31.4244 22.3409 31.4244Z" fill="#000719"/>
    </g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.1693 30.915C33.1693 30.915 51.4781 20.3758 53.2719 19.3894C55.0658 18.403 56.6437 20.3758 56.6437 22.2574C56.6437 24.139 56.6437 40.0775 56.6437 44.9062C56.6437 49.7348 56.0616 49.7348 54.2026 50.9736C52.3435 52.2124 33.0474 63.2642 31.9871 63.8316C30.9268 64.3989 28.6896 63.5524 28.6896 60.9954C28.6896 58.4385 28.6896 41.8172 28.6896 37.4675C28.6896 33.1179 33.1693 30.915 33.1693 30.915Z" fill="#405489"/>
    </svg>
    <span style="font-size: 13px; font-weight: 600;">Powered by Editmode</span></div>`

    const cacheId =  this.projectId + "_provider"
    let project = getTimedCachedData(cacheId)

    if (!project) {
      api(`/projects/${this.projectId}`)
          .then((res) => {
            storeTimedCache(cacheId, res.data);
            project = res
            if ( project.has_watermark ) {
              document.body.append(div)
            }
          })
          .catch((error) => {
            console.error(error);
          });
    } else {
      if ( project.has_watermark ) {
        document.body.append(div)
      }
    }
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
      logger('Rendering from cache: ' + chunkId)
      Component.renderChunk(el, cacheData)
    }

    // Render from default chunk
    if (!cacheData && this.defaultChunks.length) {
      logger('Rendering from defaultChunks: ' + chunkId)
      let chunk = this.defaultChunks.find(c => c.identifier == chunkId )
      storeCache(cacheid, chunk)
      Component.renderChunk(el, chunk)
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
      if (!cacheData && !this.defaultChunks.length) {
        logger('Rendering from API: ' + chunkId)
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

    if (cacheData) {
      logger('Rendering from cache: ' + collectionId)
      Component.renderCollection(el, cacheData, limit, tags)
    }

    if (!tags.length && !cacheData && this.defaultChunks.length) {
      logger('Rendering from defaultChunks: ' + collectionId)
      let chunks = this.defaultChunks.filter(c => c.collection && c.collection.identifier == collectionId)
      storeCache(cacheid, chunks)
      Component.renderCollection(el, chunks, limit, tags)
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

        if (!cacheData && !this.defaultChunks.length) {
          logger('Rendering from defaultChunks: ' + collectionId)
          Component.renderCollection(el, chunks, limit, tags)
        }
      })
  },

  // Add magic editor plugin script tag before closing body tag
  addMagicEditorPlugin: function() {
    let s = document.createElement('script')
    let url =  "https://unpkg.com/editmode-magic-editor@~1/dist/magic-editor.js"
    if(window.editmodeMagicEditorUrl) url = window.editmodeMagicEditorUrl
    s.setAttribute('src', url)
    s.async = true

    document.body.appendChild( s )
  }
}


window.EditmodeStandAlone = EditmodeStandAlone
window.EditmodeStandAlone.start()

export default EditmodeStandAlone
