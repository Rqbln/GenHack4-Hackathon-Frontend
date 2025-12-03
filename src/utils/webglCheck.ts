/**
 * WebGL utility functions for checking and initializing WebGL context
 */

export function checkWebGLSupport(): { supported: boolean; error?: string } {
  try {
    const canvas = document.createElement('canvas')
    
    // Try WebGL2 first, then fallback to WebGL1
    const gl = canvas.getContext('webgl2', { 
      antialias: false,
      depth: false,
      stencil: false,
      alpha: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false
    }) || canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false,
      alpha: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false
    })
    
    if (!gl) {
      return { supported: false, error: 'WebGL not available' }
    }
    
    // Check if context is fully initialized
    try {
      // Test accessing WebGL parameters
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
      const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS)
      
      if (!maxTextureSize || !maxViewportDims) {
        return { supported: false, error: 'WebGL context incomplete' }
      }
      
      return { supported: true }
    } catch (e) {
      return { 
        supported: false, 
        error: `WebGL context error: ${e instanceof Error ? e.message : String(e)}` 
      }
    }
  } catch (e) {
    return { 
      supported: false, 
      error: `WebGL check failed: ${e instanceof Error ? e.message : String(e)}` 
    }
  }
}

export function waitForWebGL(maxWait = 2000): Promise<{ supported: boolean; error?: string }> {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const check = () => {
      const result = checkWebGLSupport()
      
      if (result.supported) {
        resolve(result)
        return
      }
      
      if (Date.now() - startTime > maxWait) {
        resolve(result)
        return
      }
      
      // Retry after a short delay
      setTimeout(check, 100)
    }
    
    check()
  })
}

