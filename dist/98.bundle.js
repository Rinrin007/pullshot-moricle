"use strict";
(self["webpackChunkwebgame1"] = self["webpackChunkwebgame1"] || []).push([[98],{

/***/ 3098:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  WebGPURenderer: () => (/* binding */ WebGPURenderer)
});

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/extensions/Extensions.mjs
var Extensions = __webpack_require__(8507);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/maths/matrix/Matrix.mjs
var Matrix = __webpack_require__(9313);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/batcher/gpu/getTextureBatchBindGroup.mjs
var getTextureBatchBindGroup = __webpack_require__(341);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/compileHighShaderToProgram.mjs + 8 modules
var compileHighShaderToProgram = __webpack_require__(5611);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/shader-bits/colorBit.mjs
var colorBit = __webpack_require__(4459);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/shader-bits/generateTextureBatchBit.mjs
var generateTextureBatchBit = __webpack_require__(4000);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/shader-bits/localUniformBit.mjs
var localUniformBit = __webpack_require__(2067);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/shader-bits/roundPixelsBit.mjs
var roundPixelsBit = __webpack_require__(6665);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/shader/Shader.mjs
var Shader = __webpack_require__(8475);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/shader/UniformGroup.mjs + 2 modules
var UniformGroup = __webpack_require__(5811);
;// ./node_modules/pixi.js/lib/scene/graphics/gpu/GpuGraphicsAdaptor.mjs











"use strict";
class GpuGraphicsAdaptor {
  constructor() {
    this._maxTextures = 0;
  }
  contextChange(renderer) {
    const localUniforms = new UniformGroup/* UniformGroup */.k({
      uTransformMatrix: { value: new Matrix/* Matrix */.u(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    });
    this._maxTextures = renderer.limits.maxBatchableTextures;
    const gpuProgram = (0,compileHighShaderToProgram/* compileHighShaderGpuProgram */.v)({
      name: "graphics",
      bits: [
        colorBit/* colorBit */.F,
        (0,generateTextureBatchBit/* generateTextureBatchBit */._)(this._maxTextures),
        localUniformBit/* localUniformBitGroup2 */._Q,
        roundPixelsBit/* roundPixelsBit */.b
      ]
    });
    this.shader = new Shader/* Shader */.M({
      gpuProgram,
      resources: {
        // added on the fly!
        localUniforms
      }
    });
  }
  execute(graphicsPipe, renderable) {
    const context = renderable.context;
    const shader = context.customShader || this.shader;
    const renderer = graphicsPipe.renderer;
    const contextSystem = renderer.graphicsContext;
    const {
      batcher,
      instructions
    } = contextSystem.getContextRenderData(context);
    const encoder = renderer.encoder;
    encoder.setGeometry(batcher.geometry, shader.gpuProgram);
    const globalUniformsBindGroup = renderer.globalUniforms.bindGroup;
    encoder.setBindGroup(0, globalUniformsBindGroup, shader.gpuProgram);
    const localBindGroup = renderer.renderPipes.uniformBatch.getUniformBindGroup(shader.resources.localUniforms, true);
    encoder.setBindGroup(2, localBindGroup, shader.gpuProgram);
    const batches = instructions.instructions;
    let topology = null;
    for (let i = 0; i < instructions.instructionSize; i++) {
      const batch = batches[i];
      if (batch.topology !== topology) {
        topology = batch.topology;
        encoder.setPipelineFromGeometryProgramAndState(
          batcher.geometry,
          shader.gpuProgram,
          graphicsPipe.state,
          batch.topology
        );
      }
      shader.groups[1] = batch.bindGroup;
      if (!batch.gpuBindGroup) {
        const textureBatch = batch.textures;
        batch.bindGroup = (0,getTextureBatchBindGroup/* getTextureBatchBindGroup */.w)(
          textureBatch.textures,
          textureBatch.count,
          this._maxTextures
        );
        batch.gpuBindGroup = renderer.bindGroup.getBindGroup(
          batch.bindGroup,
          shader.gpuProgram,
          1
        );
      }
      encoder.setBindGroup(1, batch.bindGroup, shader.gpuProgram);
      encoder.renderPassEncoder.drawIndexed(batch.size, 1, batch.start);
    }
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GpuGraphicsAdaptor.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUPipesAdaptor
  ],
  name: "graphics"
};


//# sourceMappingURL=GpuGraphicsAdaptor.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/high-shader/shader-bits/textureBit.mjs
var textureBit = __webpack_require__(3391);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/texture/Texture.mjs + 2 modules
var Texture = __webpack_require__(4492);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/utils/logging/warn.mjs
var warn = __webpack_require__(268);
;// ./node_modules/pixi.js/lib/scene/mesh/gpu/GpuMeshAdapter.mjs










"use strict";
class GpuMeshAdapter {
  init() {
    const gpuProgram = (0,compileHighShaderToProgram/* compileHighShaderGpuProgram */.v)({
      name: "mesh",
      bits: [
        localUniformBit/* localUniformBit */.Ls,
        textureBit/* textureBit */.R,
        roundPixelsBit/* roundPixelsBit */.b
      ]
    });
    this._shader = new Shader/* Shader */.M({
      gpuProgram,
      resources: {
        uTexture: Texture/* Texture */.g.EMPTY._source,
        uSampler: Texture/* Texture */.g.EMPTY._source.style,
        textureUniforms: {
          uTextureMatrix: { type: "mat3x3<f32>", value: new Matrix/* Matrix */.u() }
        }
      }
    });
  }
  execute(meshPipe, mesh) {
    const renderer = meshPipe.renderer;
    let shader = mesh._shader;
    if (!shader) {
      shader = this._shader;
      shader.groups[2] = renderer.texture.getTextureBindGroup(mesh.texture);
    } else if (!shader.gpuProgram) {
      (0,warn/* warn */.R)("Mesh shader has no gpuProgram", mesh.shader);
      return;
    }
    const gpuProgram = shader.gpuProgram;
    if (gpuProgram.autoAssignGlobalUniforms) {
      shader.groups[0] = renderer.globalUniforms.bindGroup;
    }
    if (gpuProgram.autoAssignLocalUniforms) {
      const localUniforms = meshPipe.localUniforms;
      shader.groups[1] = renderer.renderPipes.uniformBatch.getUniformBindGroup(localUniforms, true);
    }
    renderer.encoder.draw({
      geometry: mesh._geometry,
      shader,
      state: mesh.state
    });
  }
  destroy() {
    this._shader.destroy(true);
    this._shader = null;
  }
}
/** @ignore */
GpuMeshAdapter.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUPipesAdaptor
  ],
  name: "mesh"
};


//# sourceMappingURL=GpuMeshAdapter.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/state/State.mjs
var State = __webpack_require__(7547);
;// ./node_modules/pixi.js/lib/rendering/batcher/gpu/GpuBatchAdaptor.mjs




"use strict";
const tempState = State/* State */.U.for2d();
class GpuBatchAdaptor {
  start(batchPipe, geometry, shader) {
    const renderer = batchPipe.renderer;
    const encoder = renderer.encoder;
    const program = shader.gpuProgram;
    this._shader = shader;
    this._geometry = geometry;
    encoder.setGeometry(geometry, program);
    tempState.blendMode = "normal";
    renderer.pipeline.getPipeline(
      geometry,
      program,
      tempState
    );
    const globalUniformsBindGroup = renderer.globalUniforms.bindGroup;
    encoder.resetBindGroup(1);
    encoder.setBindGroup(0, globalUniformsBindGroup, program);
  }
  execute(batchPipe, batch) {
    const program = this._shader.gpuProgram;
    const renderer = batchPipe.renderer;
    const encoder = renderer.encoder;
    if (!batch.bindGroup) {
      const textureBatch = batch.textures;
      batch.bindGroup = (0,getTextureBatchBindGroup/* getTextureBatchBindGroup */.w)(
        textureBatch.textures,
        textureBatch.count,
        renderer.limits.maxBatchableTextures
      );
    }
    tempState.blendMode = batch.blendMode;
    const gpuBindGroup = renderer.bindGroup.getBindGroup(
      batch.bindGroup,
      program,
      1
    );
    const pipeline = renderer.pipeline.getPipeline(
      this._geometry,
      program,
      tempState,
      batch.topology
    );
    batch.bindGroup._touch(renderer.textureGC.count);
    encoder.setPipeline(pipeline);
    encoder.renderPassEncoder.setBindGroup(1, gpuBindGroup);
    encoder.renderPassEncoder.drawIndexed(batch.size, 1, batch.start);
  }
}
/** @ignore */
GpuBatchAdaptor.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUPipesAdaptor
  ],
  name: "batch"
};


//# sourceMappingURL=GpuBatchAdaptor.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/system/AbstractRenderer.mjs + 1 modules
var AbstractRenderer = __webpack_require__(800);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/system/SharedSystems.mjs + 30 modules
var SharedSystems = __webpack_require__(5008);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/types.mjs
var types = __webpack_require__(5099);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/BindGroupSystem.mjs


"use strict";
class BindGroupSystem {
  constructor(renderer) {
    this._hash = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
    this._renderer.renderableGC.addManagedHash(this, "_hash");
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  getBindGroup(bindGroup, program, groupIndex) {
    bindGroup._updateKey();
    const gpuBindGroup = this._hash[bindGroup._key] || this._createBindGroup(bindGroup, program, groupIndex);
    return gpuBindGroup;
  }
  _createBindGroup(group, program, groupIndex) {
    const device = this._gpu.device;
    const groupLayout = program.layout[groupIndex];
    const entries = [];
    const renderer = this._renderer;
    for (const j in groupLayout) {
      const resource = group.resources[j] ?? group.resources[groupLayout[j]];
      let gpuResource;
      if (resource._resourceType === "uniformGroup") {
        const uniformGroup = resource;
        renderer.ubo.updateUniformGroup(uniformGroup);
        const buffer = uniformGroup.buffer;
        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size
        };
      } else if (resource._resourceType === "buffer") {
        const buffer = resource;
        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size
        };
      } else if (resource._resourceType === "bufferResource") {
        const bufferResource = resource;
        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(bufferResource.buffer),
          offset: bufferResource.offset,
          size: bufferResource.size
        };
      } else if (resource._resourceType === "textureSampler") {
        const sampler = resource;
        gpuResource = renderer.texture.getGpuSampler(sampler);
      } else if (resource._resourceType === "textureSource") {
        const texture = resource;
        gpuResource = renderer.texture.getGpuSource(texture).createView({});
      }
      entries.push({
        binding: groupLayout[j],
        resource: gpuResource
      });
    }
    const layout = renderer.shader.getProgramData(program).bindGroups[groupIndex];
    const gpuBindGroup = device.createBindGroup({
      layout,
      entries
    });
    this._hash[group._key] = gpuBindGroup;
    return gpuBindGroup;
  }
  destroy() {
    for (const key of Object.keys(this._hash)) {
      this._hash[key] = null;
    }
    this._hash = null;
    this._renderer = null;
  }
}
/** @ignore */
BindGroupSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "bindGroup"
};


//# sourceMappingURL=BindGroupSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/buffer/utils/fastCopy.mjs
var fastCopy = __webpack_require__(6736);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/buffer/GpuBufferSystem.mjs



"use strict";
class GpuBufferSystem {
  constructor(renderer) {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null);
    this._managedBuffers = [];
    renderer.renderableGC.addManagedHash(this, "_gpuBuffers");
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  getGPUBuffer(buffer) {
    return this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
  }
  updateBuffer(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
    const data = buffer.data;
    if (buffer._updateID && data) {
      buffer._updateID = 0;
      this._gpu.device.queue.writeBuffer(
        gpuBuffer,
        0,
        data.buffer,
        0,
        // round to the nearest 4 bytes
        (buffer._updateSize || data.byteLength) + 3 & ~3
      );
    }
    return gpuBuffer;
  }
  /** dispose all WebGL resources of all managed buffers */
  destroyAll() {
    for (const id in this._gpuBuffers) {
      this._gpuBuffers[id].destroy();
    }
    this._gpuBuffers = {};
  }
  createGPUBuffer(buffer) {
    if (!this._gpuBuffers[buffer.uid]) {
      buffer.on("update", this.updateBuffer, this);
      buffer.on("change", this.onBufferChange, this);
      buffer.on("destroy", this.onBufferDestroy, this);
      this._managedBuffers.push(buffer);
    }
    const gpuBuffer = this._gpu.device.createBuffer(buffer.descriptor);
    buffer._updateID = 0;
    if (buffer.data) {
      (0,fastCopy/* fastCopy */.W)(buffer.data.buffer, gpuBuffer.getMappedRange());
      gpuBuffer.unmap();
    }
    this._gpuBuffers[buffer.uid] = gpuBuffer;
    return gpuBuffer;
  }
  onBufferChange(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    buffer._updateID = 0;
    this._gpuBuffers[buffer.uid] = this.createGPUBuffer(buffer);
  }
  /**
   * Disposes buffer
   * @param buffer - buffer with data
   */
  onBufferDestroy(buffer) {
    this._managedBuffers.splice(this._managedBuffers.indexOf(buffer), 1);
    this._destroyBuffer(buffer);
  }
  destroy() {
    this._managedBuffers.forEach((buffer) => this._destroyBuffer(buffer));
    this._managedBuffers = null;
    this._gpuBuffers = null;
  }
  _destroyBuffer(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    buffer.off("update", this.updateBuffer, this);
    buffer.off("change", this.onBufferChange, this);
    buffer.off("destroy", this.onBufferDestroy, this);
    this._gpuBuffers[buffer.uid] = null;
  }
}
/** @ignore */
GpuBufferSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "buffer"
};


//# sourceMappingURL=GpuBufferSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuColorMaskSystem.mjs


"use strict";
class GpuColorMaskSystem {
  constructor(renderer) {
    this._colorMaskCache = 15;
    this._renderer = renderer;
  }
  setMask(colorMask) {
    if (this._colorMaskCache === colorMask)
      return;
    this._colorMaskCache = colorMask;
    this._renderer.pipeline.setColorMask(colorMask);
  }
  destroy() {
    this._renderer = null;
    this._colorMaskCache = null;
  }
}
/** @ignore */
GpuColorMaskSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "colorMask"
};


//# sourceMappingURL=GpuColorMaskSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/environment/adapter.mjs + 1 modules
var environment_adapter = __webpack_require__(1761);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuDeviceSystem.mjs



"use strict";
class GpuDeviceSystem {
  /**
   * @param {WebGPURenderer} renderer - The renderer this System works for.
   */
  constructor(renderer) {
    this._renderer = renderer;
  }
  async init(options) {
    if (this._initPromise)
      return this._initPromise;
    this._initPromise = this._createDeviceAndAdaptor(options).then((gpu) => {
      this.gpu = gpu;
      this._renderer.runners.contextChange.emit(this.gpu);
    });
    return this._initPromise;
  }
  /**
   * Handle the context change event
   * @param gpu
   */
  contextChange(gpu) {
    this._renderer.gpu = gpu;
  }
  /**
   * Helper class to create a WebGL Context
   * @param {object} options - An options object that gets passed in to the canvas element containing the
   *    context attributes
   * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
   * @returns {WebGLRenderingContext} the WebGL context
   */
  async _createDeviceAndAdaptor(options) {
    const adapter = await environment_adapter/* DOMAdapter */.e.get().getNavigator().gpu.requestAdapter({
      powerPreference: options.powerPreference,
      forceFallbackAdapter: options.forceFallbackAdapter
    });
    const requiredFeatures = [
      "texture-compression-bc",
      "texture-compression-astc",
      "texture-compression-etc2"
    ].filter((feature) => adapter.features.has(feature));
    const device = await adapter.requestDevice({
      requiredFeatures
    });
    return { adapter, device };
  }
  destroy() {
    this.gpu = null;
    this._renderer = null;
  }
}
/** @ignore */
GpuDeviceSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "device"
};
/** The default options for the GpuDeviceSystem. */
GpuDeviceSystem.defaultOptions = {
  /**
   * {@link WebGPUOptions.powerPreference}
   * @default default
   */
  powerPreference: void 0,
  /**
   * Force the use of the fallback adapter
   * @default false
   */
  forceFallbackAdapter: false
};


//# sourceMappingURL=GpuDeviceSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuEncoderSystem.mjs


"use strict";
class GpuEncoderSystem {
  constructor(renderer) {
    this._boundBindGroup = /* @__PURE__ */ Object.create(null);
    this._boundVertexBuffer = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
  }
  renderStart() {
    this.commandFinished = new Promise((resolve) => {
      this._resolveCommandFinished = resolve;
    });
    this.commandEncoder = this._renderer.gpu.device.createCommandEncoder();
  }
  beginRenderPass(gpuRenderTarget) {
    this.endRenderPass();
    this._clearCache();
    this.renderPassEncoder = this.commandEncoder.beginRenderPass(gpuRenderTarget.descriptor);
  }
  endRenderPass() {
    if (this.renderPassEncoder) {
      this.renderPassEncoder.end();
    }
    this.renderPassEncoder = null;
  }
  setViewport(viewport) {
    this.renderPassEncoder.setViewport(viewport.x, viewport.y, viewport.width, viewport.height, 0, 1);
  }
  setPipelineFromGeometryProgramAndState(geometry, program, state, topology) {
    const pipeline = this._renderer.pipeline.getPipeline(geometry, program, state, topology);
    this.setPipeline(pipeline);
  }
  setPipeline(pipeline) {
    if (this._boundPipeline === pipeline)
      return;
    this._boundPipeline = pipeline;
    this.renderPassEncoder.setPipeline(pipeline);
  }
  _setVertexBuffer(index, buffer) {
    if (this._boundVertexBuffer[index] === buffer)
      return;
    this._boundVertexBuffer[index] = buffer;
    this.renderPassEncoder.setVertexBuffer(index, this._renderer.buffer.updateBuffer(buffer));
  }
  _setIndexBuffer(buffer) {
    if (this._boundIndexBuffer === buffer)
      return;
    this._boundIndexBuffer = buffer;
    const indexFormat = buffer.data.BYTES_PER_ELEMENT === 2 ? "uint16" : "uint32";
    this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(buffer), indexFormat);
  }
  resetBindGroup(index) {
    this._boundBindGroup[index] = null;
  }
  setBindGroup(index, bindGroup, program) {
    if (this._boundBindGroup[index] === bindGroup)
      return;
    this._boundBindGroup[index] = bindGroup;
    bindGroup._touch(this._renderer.textureGC.count);
    const gpuBindGroup = this._renderer.bindGroup.getBindGroup(bindGroup, program, index);
    this.renderPassEncoder.setBindGroup(index, gpuBindGroup);
  }
  setGeometry(geometry, program) {
    const buffersToBind = this._renderer.pipeline.getBufferNamesToBind(geometry, program);
    for (const i in buffersToBind) {
      this._setVertexBuffer(i, geometry.attributes[buffersToBind[i]].buffer);
    }
    if (geometry.indexBuffer) {
      this._setIndexBuffer(geometry.indexBuffer);
    }
  }
  _setShaderBindGroups(shader, skipSync) {
    for (const i in shader.groups) {
      const bindGroup = shader.groups[i];
      if (!skipSync) {
        this._syncBindGroup(bindGroup);
      }
      this.setBindGroup(i, bindGroup, shader.gpuProgram);
    }
  }
  _syncBindGroup(bindGroup) {
    for (const j in bindGroup.resources) {
      const resource = bindGroup.resources[j];
      if (resource.isUniformGroup) {
        this._renderer.ubo.updateUniformGroup(resource);
      }
    }
  }
  draw(options) {
    const { geometry, shader, state, topology, size, start, instanceCount, skipSync } = options;
    this.setPipelineFromGeometryProgramAndState(geometry, shader.gpuProgram, state, topology);
    this.setGeometry(geometry, shader.gpuProgram);
    this._setShaderBindGroups(shader, skipSync);
    if (geometry.indexBuffer) {
      this.renderPassEncoder.drawIndexed(
        size || geometry.indexBuffer.data.length,
        instanceCount ?? geometry.instanceCount,
        start || 0
      );
    } else {
      this.renderPassEncoder.draw(size || geometry.getSize(), instanceCount ?? geometry.instanceCount, start || 0);
    }
  }
  finishRenderPass() {
    if (this.renderPassEncoder) {
      this.renderPassEncoder.end();
      this.renderPassEncoder = null;
    }
  }
  postrender() {
    this.finishRenderPass();
    this._gpu.device.queue.submit([this.commandEncoder.finish()]);
    this._resolveCommandFinished();
    this.commandEncoder = null;
  }
  // restores a render pass if finishRenderPass was called
  // not optimised as really used for debugging!
  // used when we want to stop drawing and log a texture..
  restoreRenderPass() {
    const descriptor = this._renderer.renderTarget.adaptor.getDescriptor(
      this._renderer.renderTarget.renderTarget,
      false,
      [0, 0, 0, 1]
    );
    this.renderPassEncoder = this.commandEncoder.beginRenderPass(descriptor);
    const boundPipeline = this._boundPipeline;
    const boundVertexBuffer = { ...this._boundVertexBuffer };
    const boundIndexBuffer = this._boundIndexBuffer;
    const boundBindGroup = { ...this._boundBindGroup };
    this._clearCache();
    const viewport = this._renderer.renderTarget.viewport;
    this.renderPassEncoder.setViewport(viewport.x, viewport.y, viewport.width, viewport.height, 0, 1);
    this.setPipeline(boundPipeline);
    for (const i in boundVertexBuffer) {
      this._setVertexBuffer(i, boundVertexBuffer[i]);
    }
    for (const i in boundBindGroup) {
      this.setBindGroup(i, boundBindGroup[i], null);
    }
    this._setIndexBuffer(boundIndexBuffer);
  }
  _clearCache() {
    for (let i = 0; i < 16; i++) {
      this._boundBindGroup[i] = null;
      this._boundVertexBuffer[i] = null;
    }
    this._boundIndexBuffer = null;
    this._boundPipeline = null;
  }
  destroy() {
    this._renderer = null;
    this._gpu = null;
    this._boundBindGroup = null;
    this._boundVertexBuffer = null;
    this._boundIndexBuffer = null;
    this._boundPipeline = null;
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
}
/** @ignore */
GpuEncoderSystem.extension = {
  type: [Extensions/* ExtensionType */.Ag.WebGPUSystem],
  name: "encoder",
  priority: 1
};


//# sourceMappingURL=GpuEncoderSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuLimitsSystem.mjs


"use strict";
class GpuLimitsSystem {
  constructor(renderer) {
    this._renderer = renderer;
  }
  contextChange() {
    this.maxTextures = this._renderer.device.gpu.device.limits.maxSampledTexturesPerShaderStage;
    this.maxBatchableTextures = this.maxTextures;
  }
  destroy() {
  }
}
/** @ignore */
GpuLimitsSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "limits"
};


//# sourceMappingURL=GpuLimitsSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/state/const.mjs
var state_const = __webpack_require__(1957);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuStencilSystem.mjs



"use strict";
class GpuStencilSystem {
  constructor(renderer) {
    this._renderTargetStencilState = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
    renderer.renderTarget.onRenderTargetChange.add(this);
  }
  onRenderTargetChange(renderTarget) {
    let stencilState = this._renderTargetStencilState[renderTarget.uid];
    if (!stencilState) {
      stencilState = this._renderTargetStencilState[renderTarget.uid] = {
        stencilMode: state_const/* STENCIL_MODES */.K.DISABLED,
        stencilReference: 0
      };
    }
    this._activeRenderTarget = renderTarget;
    this.setStencilMode(stencilState.stencilMode, stencilState.stencilReference);
  }
  setStencilMode(stencilMode, stencilReference) {
    const stencilState = this._renderTargetStencilState[this._activeRenderTarget.uid];
    stencilState.stencilMode = stencilMode;
    stencilState.stencilReference = stencilReference;
    const renderer = this._renderer;
    renderer.pipeline.setStencilMode(stencilMode);
    renderer.encoder.renderPassEncoder.setStencilReference(stencilReference);
  }
  destroy() {
    this._renderer.renderTarget.onRenderTargetChange.remove(this);
    this._renderer = null;
    this._activeRenderTarget = null;
    this._renderTargetStencilState = null;
  }
}
/** @ignore */
GpuStencilSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "stencil"
};


//# sourceMappingURL=GpuStencilSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/shader/UboSystem.mjs
var UboSystem = __webpack_require__(7047);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboElementsWGSL.mjs

const WGSL_ALIGN_SIZE_DATA = {
  i32: { align: 4, size: 4 },
  u32: { align: 4, size: 4 },
  f32: { align: 4, size: 4 },
  f16: { align: 2, size: 2 },
  "vec2<i32>": { align: 8, size: 8 },
  "vec2<u32>": { align: 8, size: 8 },
  "vec2<f32>": { align: 8, size: 8 },
  "vec2<f16>": { align: 4, size: 4 },
  "vec3<i32>": { align: 16, size: 12 },
  "vec3<u32>": { align: 16, size: 12 },
  "vec3<f32>": { align: 16, size: 12 },
  "vec3<f16>": { align: 8, size: 6 },
  "vec4<i32>": { align: 16, size: 16 },
  "vec4<u32>": { align: 16, size: 16 },
  "vec4<f32>": { align: 16, size: 16 },
  "vec4<f16>": { align: 8, size: 8 },
  "mat2x2<f32>": { align: 8, size: 16 },
  "mat2x2<f16>": { align: 4, size: 8 },
  "mat3x2<f32>": { align: 8, size: 24 },
  "mat3x2<f16>": { align: 4, size: 12 },
  "mat4x2<f32>": { align: 8, size: 32 },
  "mat4x2<f16>": { align: 4, size: 16 },
  "mat2x3<f32>": { align: 16, size: 32 },
  "mat2x3<f16>": { align: 8, size: 16 },
  "mat3x3<f32>": { align: 16, size: 48 },
  "mat3x3<f16>": { align: 8, size: 24 },
  "mat4x3<f32>": { align: 16, size: 64 },
  "mat4x3<f16>": { align: 8, size: 32 },
  "mat2x4<f32>": { align: 16, size: 32 },
  "mat2x4<f16>": { align: 8, size: 16 },
  "mat3x4<f32>": { align: 16, size: 48 },
  "mat3x4<f16>": { align: 8, size: 24 },
  "mat4x4<f32>": { align: 16, size: 64 },
  "mat4x4<f16>": { align: 8, size: 32 }
};
function createUboElementsWGSL(uniformData) {
  const uboElements = uniformData.map((data) => ({
    data,
    offset: 0,
    size: 0
  }));
  let offset = 0;
  for (let i = 0; i < uboElements.length; i++) {
    const uboElement = uboElements[i];
    let size = WGSL_ALIGN_SIZE_DATA[uboElement.data.type].size;
    const align = WGSL_ALIGN_SIZE_DATA[uboElement.data.type].align;
    if (!WGSL_ALIGN_SIZE_DATA[uboElement.data.type]) {
      throw new Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${uboElement.data.type}`);
    }
    if (uboElement.data.size > 1) {
      size = Math.max(size, align) * uboElement.data.size;
    }
    offset = Math.ceil(offset / align) * align;
    uboElement.size = size;
    uboElement.offset = offset;
    offset += size;
  }
  offset = Math.ceil(offset / 16) * 16;
  return { uboElements, size: offset };
}


//# sourceMappingURL=createUboElementsWGSL.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/createUboSyncFunction.mjs
var createUboSyncFunction = __webpack_require__(6423);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/uboSyncFunctions.mjs
var uboSyncFunctions = __webpack_require__(1266);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateArraySyncWGSL.mjs


"use strict";
function generateArraySyncWGSL(uboElement, offsetToAdd) {
  const { size, align } = WGSL_ALIGN_SIZE_DATA[uboElement.data.type];
  const remainder = (align - size) / 4;
  const data = uboElement.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
  return `
         v = uv.${uboElement.data.name};
         ${offsetToAdd !== 0 ? `offset += ${offsetToAdd};` : ""}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${uboElement.data.size * (size / 4)}; i++)
         {
             for(var j = 0; j < ${size / 4}; j++)
             {
                 ${data}[arrayOffset++] = v[t++];
             }
             ${remainder !== 0 ? `arrayOffset += ${remainder};` : ""}
         }
     `;
}


//# sourceMappingURL=generateArraySyncWGSL.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboSyncFunctionWGSL.mjs




"use strict";
function createUboSyncFunctionWGSL(uboElements) {
  return (0,createUboSyncFunction/* createUboSyncFunction */.E)(
    uboElements,
    "uboWgsl",
    generateArraySyncWGSL,
    uboSyncFunctions/* uboSyncFunctionsWGSL */._
  );
}


//# sourceMappingURL=createUboSyncFunctionWGSL.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuUboSystem.mjs





"use strict";
class GpuUboSystem extends UboSystem/* UboSystem */.W {
  constructor() {
    super({
      createUboElements: createUboElementsWGSL,
      generateUboSync: createUboSyncFunctionWGSL
    });
  }
}
/** @ignore */
GpuUboSystem.extension = {
  type: [Extensions/* ExtensionType */.Ag.WebGPUSystem],
  name: "ubo"
};


//# sourceMappingURL=GpuUboSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/buffer/Buffer.mjs
var Buffer = __webpack_require__(949);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/buffer/BufferResource.mjs
var BufferResource = __webpack_require__(581);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/buffer/const.mjs
var buffer_const = __webpack_require__(1132);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/buffer/UboBatch.mjs

class UboBatch {
  constructor({ minUniformOffsetAlignment }) {
    this._minUniformOffsetAlignment = 256;
    this.byteIndex = 0;
    this._minUniformOffsetAlignment = minUniformOffsetAlignment;
    this.data = new Float32Array(65535);
  }
  clear() {
    this.byteIndex = 0;
  }
  addEmptyGroup(size) {
    if (size > this._minUniformOffsetAlignment / 4) {
      throw new Error(`UniformBufferBatch: array is too large: ${size * 4}`);
    }
    const start = this.byteIndex;
    let newSize = start + size * 4;
    newSize = Math.ceil(newSize / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment;
    if (newSize > this.data.length * 4) {
      throw new Error("UniformBufferBatch: ubo batch got too big");
    }
    this.byteIndex = newSize;
    return start;
  }
  addGroup(array) {
    const offset = this.addEmptyGroup(array.length);
    for (let i = 0; i < array.length; i++) {
      this.data[offset / 4 + i] = array[i];
    }
    return offset;
  }
  destroy() {
    this.data = null;
  }
}


//# sourceMappingURL=UboBatch.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/gpu/shader/BindGroup.mjs
var BindGroup = __webpack_require__(3513);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/GpuUniformBatchPipe.mjs







"use strict";
const minUniformOffsetAlignment = 128;
class GpuUniformBatchPipe {
  constructor(renderer) {
    this._bindGroupHash = /* @__PURE__ */ Object.create(null);
    // number of buffers..
    this._buffers = [];
    this._bindGroups = [];
    this._bufferResources = [];
    this._renderer = renderer;
    this._renderer.renderableGC.addManagedHash(this, "_bindGroupHash");
    this._batchBuffer = new UboBatch({ minUniformOffsetAlignment });
    const totalBuffers = 256 / minUniformOffsetAlignment;
    for (let i = 0; i < totalBuffers; i++) {
      let usage = buffer_const/* BufferUsage */.S.UNIFORM | buffer_const/* BufferUsage */.S.COPY_DST;
      if (i === 0)
        usage |= buffer_const/* BufferUsage */.S.COPY_SRC;
      this._buffers.push(new Buffer/* Buffer */.h({
        data: this._batchBuffer.data,
        usage
      }));
    }
  }
  renderEnd() {
    this._uploadBindGroups();
    this._resetBindGroups();
  }
  _resetBindGroups() {
    for (const i in this._bindGroupHash) {
      this._bindGroupHash[i] = null;
    }
    this._batchBuffer.clear();
  }
  // just works for single bind groups for now
  getUniformBindGroup(group, duplicate) {
    if (!duplicate && this._bindGroupHash[group.uid]) {
      return this._bindGroupHash[group.uid];
    }
    this._renderer.ubo.ensureUniformGroup(group);
    const data = group.buffer.data;
    const offset = this._batchBuffer.addEmptyGroup(data.length);
    this._renderer.ubo.syncUniformGroup(group, this._batchBuffer.data, offset / 4);
    this._bindGroupHash[group.uid] = this._getBindGroup(offset / minUniformOffsetAlignment);
    return this._bindGroupHash[group.uid];
  }
  getUboResource(group) {
    this._renderer.ubo.updateUniformGroup(group);
    const data = group.buffer.data;
    const offset = this._batchBuffer.addGroup(data);
    return this._getBufferResource(offset / minUniformOffsetAlignment);
  }
  getArrayBindGroup(data) {
    const offset = this._batchBuffer.addGroup(data);
    return this._getBindGroup(offset / minUniformOffsetAlignment);
  }
  getArrayBufferResource(data) {
    const offset = this._batchBuffer.addGroup(data);
    const index = offset / minUniformOffsetAlignment;
    return this._getBufferResource(index);
  }
  _getBufferResource(index) {
    if (!this._bufferResources[index]) {
      const buffer = this._buffers[index % 2];
      this._bufferResources[index] = new BufferResource/* BufferResource */.d({
        buffer,
        offset: (index / 2 | 0) * 256,
        size: minUniformOffsetAlignment
      });
    }
    return this._bufferResources[index];
  }
  _getBindGroup(index) {
    if (!this._bindGroups[index]) {
      const bindGroup = new BindGroup/* BindGroup */.T({
        0: this._getBufferResource(index)
      });
      this._bindGroups[index] = bindGroup;
    }
    return this._bindGroups[index];
  }
  _uploadBindGroups() {
    const bufferSystem = this._renderer.buffer;
    const firstBuffer = this._buffers[0];
    firstBuffer.update(this._batchBuffer.byteIndex);
    bufferSystem.updateBuffer(firstBuffer);
    const commandEncoder = this._renderer.gpu.device.createCommandEncoder();
    for (let i = 1; i < this._buffers.length; i++) {
      const buffer = this._buffers[i];
      commandEncoder.copyBufferToBuffer(
        bufferSystem.getGPUBuffer(firstBuffer),
        minUniformOffsetAlignment,
        bufferSystem.getGPUBuffer(buffer),
        0,
        this._batchBuffer.byteIndex
      );
    }
    this._renderer.gpu.device.queue.submit([commandEncoder.finish()]);
  }
  destroy() {
    for (let i = 0; i < this._bindGroups.length; i++) {
      this._bindGroups[i].destroy();
    }
    this._bindGroups = null;
    this._bindGroupHash = null;
    for (let i = 0; i < this._buffers.length; i++) {
      this._buffers[i].destroy();
    }
    this._buffers = null;
    for (let i = 0; i < this._bufferResources.length; i++) {
      this._bufferResources[i].destroy();
    }
    this._bufferResources = null;
    this._batchBuffer.destroy();
    this._bindGroupHash = null;
    this._renderer = null;
  }
}
/** @ignore */
GpuUniformBatchPipe.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUPipes
  ],
  name: "uniformBatch"
};


//# sourceMappingURL=GpuUniformBatchPipe.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/ensureAttributes.mjs
var ensureAttributes = __webpack_require__(7084);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/utils/createIdFromString.mjs
var createIdFromString = __webpack_require__(7952);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/gpu/state/GpuStencilModesToPixi.mjs
var GpuStencilModesToPixi = __webpack_require__(1172);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/pipeline/PipelineSystem.mjs







"use strict";
const topologyStringToId = {
  "point-list": 0,
  "line-list": 1,
  "line-strip": 2,
  "triangle-list": 3,
  "triangle-strip": 4
};
function getGraphicsStateKey(geometryLayout, shaderKey, state, blendMode, topology) {
  return geometryLayout << 24 | shaderKey << 16 | state << 10 | blendMode << 5 | topology;
}
function getGlobalStateKey(stencilStateId, multiSampleCount, colorMask, renderTarget) {
  return colorMask << 6 | stencilStateId << 3 | renderTarget << 1 | multiSampleCount;
}
class PipelineSystem {
  constructor(renderer) {
    this._moduleCache = /* @__PURE__ */ Object.create(null);
    this._bufferLayoutsCache = /* @__PURE__ */ Object.create(null);
    this._bindingNamesCache = /* @__PURE__ */ Object.create(null);
    this._pipeCache = /* @__PURE__ */ Object.create(null);
    this._pipeStateCaches = /* @__PURE__ */ Object.create(null);
    this._colorMask = 15;
    this._multisampleCount = 1;
    this._renderer = renderer;
  }
  contextChange(gpu) {
    this._gpu = gpu;
    this.setStencilMode(state_const/* STENCIL_MODES */.K.DISABLED);
    this._updatePipeHash();
  }
  setMultisampleCount(multisampleCount) {
    if (this._multisampleCount === multisampleCount)
      return;
    this._multisampleCount = multisampleCount;
    this._updatePipeHash();
  }
  setRenderTarget(renderTarget) {
    this._multisampleCount = renderTarget.msaaSamples;
    this._depthStencilAttachment = renderTarget.descriptor.depthStencilAttachment ? 1 : 0;
    this._updatePipeHash();
  }
  setColorMask(colorMask) {
    if (this._colorMask === colorMask)
      return;
    this._colorMask = colorMask;
    this._updatePipeHash();
  }
  setStencilMode(stencilMode) {
    if (this._stencilMode === stencilMode)
      return;
    this._stencilMode = stencilMode;
    this._stencilState = GpuStencilModesToPixi/* GpuStencilModesToPixi */.g[stencilMode];
    this._updatePipeHash();
  }
  setPipeline(geometry, program, state, passEncoder) {
    const pipeline = this.getPipeline(geometry, program, state);
    passEncoder.setPipeline(pipeline);
  }
  getPipeline(geometry, program, state, topology) {
    if (!geometry._layoutKey) {
      (0,ensureAttributes/* ensureAttributes */.q)(geometry, program.attributeData);
      this._generateBufferKey(geometry);
    }
    topology || (topology = geometry.topology);
    const key = getGraphicsStateKey(
      geometry._layoutKey,
      program._layoutKey,
      state.data,
      state._blendModeId,
      topologyStringToId[topology]
    );
    if (this._pipeCache[key])
      return this._pipeCache[key];
    this._pipeCache[key] = this._createPipeline(geometry, program, state, topology);
    return this._pipeCache[key];
  }
  _createPipeline(geometry, program, state, topology) {
    const device = this._gpu.device;
    const buffers = this._createVertexBufferLayouts(geometry, program);
    const blendModes = this._renderer.state.getColorTargets(state);
    blendModes[0].writeMask = this._stencilMode === state_const/* STENCIL_MODES */.K.RENDERING_MASK_ADD ? 0 : this._colorMask;
    const layout = this._renderer.shader.getProgramData(program).pipeline;
    const descriptor = {
      // TODO later check if its helpful to create..
      // layout,
      vertex: {
        module: this._getModule(program.vertex.source),
        entryPoint: program.vertex.entryPoint,
        // geometry..
        buffers
      },
      fragment: {
        module: this._getModule(program.fragment.source),
        entryPoint: program.fragment.entryPoint,
        targets: blendModes
      },
      primitive: {
        topology,
        cullMode: state.cullMode
      },
      layout,
      multisample: {
        count: this._multisampleCount
      },
      // depthStencil,
      label: `PIXI Pipeline`
    };
    if (this._depthStencilAttachment) {
      descriptor.depthStencil = {
        ...this._stencilState,
        format: "depth24plus-stencil8",
        depthWriteEnabled: state.depthTest,
        depthCompare: state.depthTest ? "less" : "always"
      };
    }
    const pipeline = device.createRenderPipeline(descriptor);
    return pipeline;
  }
  _getModule(code) {
    return this._moduleCache[code] || this._createModule(code);
  }
  _createModule(code) {
    const device = this._gpu.device;
    this._moduleCache[code] = device.createShaderModule({
      code
    });
    return this._moduleCache[code];
  }
  _generateBufferKey(geometry) {
    const keyGen = [];
    let index = 0;
    const attributeKeys = Object.keys(geometry.attributes).sort();
    for (let i = 0; i < attributeKeys.length; i++) {
      const attribute = geometry.attributes[attributeKeys[i]];
      keyGen[index++] = attribute.offset;
      keyGen[index++] = attribute.format;
      keyGen[index++] = attribute.stride;
      keyGen[index++] = attribute.instance;
    }
    const stringKey = keyGen.join("|");
    geometry._layoutKey = (0,createIdFromString/* createIdFromString */.X)(stringKey, "geometry");
    return geometry._layoutKey;
  }
  _generateAttributeLocationsKey(program) {
    const keyGen = [];
    let index = 0;
    const attributeKeys = Object.keys(program.attributeData).sort();
    for (let i = 0; i < attributeKeys.length; i++) {
      const attribute = program.attributeData[attributeKeys[i]];
      keyGen[index++] = attribute.location;
    }
    const stringKey = keyGen.join("|");
    program._attributeLocationsKey = (0,createIdFromString/* createIdFromString */.X)(stringKey, "programAttributes");
    return program._attributeLocationsKey;
  }
  /**
   * Returns a hash of buffer names mapped to bind locations.
   * This is used to bind the correct buffer to the correct location in the shader.
   * @param geometry - The geometry where to get the buffer names
   * @param program - The program where to get the buffer names
   * @returns An object of buffer names mapped to the bind location.
   */
  getBufferNamesToBind(geometry, program) {
    const key = geometry._layoutKey << 16 | program._attributeLocationsKey;
    if (this._bindingNamesCache[key])
      return this._bindingNamesCache[key];
    const data = this._createVertexBufferLayouts(geometry, program);
    const bufferNamesToBind = /* @__PURE__ */ Object.create(null);
    const attributeData = program.attributeData;
    for (let i = 0; i < data.length; i++) {
      const attributes = Object.values(data[i].attributes);
      const shaderLocation = attributes[0].shaderLocation;
      for (const j in attributeData) {
        if (attributeData[j].location === shaderLocation) {
          bufferNamesToBind[i] = j;
          break;
        }
      }
    }
    this._bindingNamesCache[key] = bufferNamesToBind;
    return bufferNamesToBind;
  }
  _createVertexBufferLayouts(geometry, program) {
    if (!program._attributeLocationsKey)
      this._generateAttributeLocationsKey(program);
    const key = geometry._layoutKey << 16 | program._attributeLocationsKey;
    if (this._bufferLayoutsCache[key]) {
      return this._bufferLayoutsCache[key];
    }
    const vertexBuffersLayout = [];
    geometry.buffers.forEach((buffer) => {
      const bufferEntry = {
        arrayStride: 0,
        stepMode: "vertex",
        attributes: []
      };
      const bufferEntryAttributes = bufferEntry.attributes;
      for (const i in program.attributeData) {
        const attribute = geometry.attributes[i];
        if ((attribute.divisor ?? 1) !== 1) {
          (0,warn/* warn */.R)(`Attribute ${i} has an invalid divisor value of '${attribute.divisor}'. WebGPU only supports a divisor value of 1`);
        }
        if (attribute.buffer === buffer) {
          bufferEntry.arrayStride = attribute.stride;
          bufferEntry.stepMode = attribute.instance ? "instance" : "vertex";
          bufferEntryAttributes.push({
            shaderLocation: program.attributeData[i].location,
            offset: attribute.offset,
            format: attribute.format
          });
        }
      }
      if (bufferEntryAttributes.length) {
        vertexBuffersLayout.push(bufferEntry);
      }
    });
    this._bufferLayoutsCache[key] = vertexBuffersLayout;
    return vertexBuffersLayout;
  }
  _updatePipeHash() {
    const key = getGlobalStateKey(
      this._stencilMode,
      this._multisampleCount,
      this._colorMask,
      this._depthStencilAttachment
    );
    if (!this._pipeStateCaches[key]) {
      this._pipeStateCaches[key] = /* @__PURE__ */ Object.create(null);
    }
    this._pipeCache = this._pipeStateCaches[key];
  }
  destroy() {
    this._renderer = null;
    this._bufferLayoutsCache = null;
  }
}
/** @ignore */
PipelineSystem.extension = {
  type: [Extensions/* ExtensionType */.Ag.WebGPUSystem],
  name: "pipeline"
};


//# sourceMappingURL=PipelineSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/renderTarget/RenderTargetSystem.mjs + 2 modules
var RenderTargetSystem = __webpack_require__(7238);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/gl/const.mjs
var gl_const = __webpack_require__(1257);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/texture/sources/CanvasSource.mjs
var CanvasSource = __webpack_require__(4884);
// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/texture/sources/TextureSource.mjs
var TextureSource = __webpack_require__(583);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/GpuRenderTarget.mjs

class GpuRenderTarget {
  constructor() {
    this.contexts = [];
    this.msaaTextures = [];
    this.msaaSamples = 1;
  }
}


//# sourceMappingURL=GpuRenderTarget.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/GpuRenderTargetAdaptor.mjs





"use strict";
class GpuRenderTargetAdaptor {
  init(renderer, renderTargetSystem) {
    this._renderer = renderer;
    this._renderTargetSystem = renderTargetSystem;
  }
  copyToTexture(sourceRenderSurfaceTexture, destinationTexture, originSrc, size, originDest) {
    const renderer = this._renderer;
    const baseGpuTexture = this._getGpuColorTexture(
      sourceRenderSurfaceTexture
    );
    const backGpuTexture = renderer.texture.getGpuSource(
      destinationTexture.source
    );
    renderer.encoder.commandEncoder.copyTextureToTexture(
      {
        texture: baseGpuTexture,
        origin: originSrc
      },
      {
        texture: backGpuTexture,
        origin: originDest
      },
      size
    );
    return destinationTexture;
  }
  startRenderPass(renderTarget, clear = true, clearColor, viewport) {
    const renderTargetSystem = this._renderTargetSystem;
    const gpuRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
    const descriptor = this.getDescriptor(renderTarget, clear, clearColor);
    gpuRenderTarget.descriptor = descriptor;
    this._renderer.pipeline.setRenderTarget(gpuRenderTarget);
    this._renderer.encoder.beginRenderPass(gpuRenderTarget);
    this._renderer.encoder.setViewport(viewport);
  }
  finishRenderPass() {
    this._renderer.encoder.endRenderPass();
  }
  /**
   * returns the gpu texture for the first color texture in the render target
   * mainly used by the filter manager to get copy the texture for blending
   * @param renderTarget
   * @returns a gpu texture
   */
  _getGpuColorTexture(renderTarget) {
    const gpuRenderTarget = this._renderTargetSystem.getGpuRenderTarget(renderTarget);
    if (gpuRenderTarget.contexts[0]) {
      return gpuRenderTarget.contexts[0].getCurrentTexture();
    }
    return this._renderer.texture.getGpuSource(
      renderTarget.colorTextures[0].source
    );
  }
  getDescriptor(renderTarget, clear, clearValue) {
    if (typeof clear === "boolean") {
      clear = clear ? gl_const/* CLEAR */.u.ALL : gl_const/* CLEAR */.u.NONE;
    }
    const renderTargetSystem = this._renderTargetSystem;
    const gpuRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
    const colorAttachments = renderTarget.colorTextures.map(
      (texture, i) => {
        const context = gpuRenderTarget.contexts[i];
        let view;
        let resolveTarget;
        if (context) {
          const currentTexture = context.getCurrentTexture();
          const canvasTextureView = currentTexture.createView();
          view = canvasTextureView;
        } else {
          view = this._renderer.texture.getGpuSource(texture).createView({
            mipLevelCount: 1
          });
        }
        if (gpuRenderTarget.msaaTextures[i]) {
          resolveTarget = view;
          view = this._renderer.texture.getTextureView(
            gpuRenderTarget.msaaTextures[i]
          );
        }
        const loadOp = clear & gl_const/* CLEAR */.u.COLOR ? "clear" : "load";
        clearValue ?? (clearValue = renderTargetSystem.defaultClearColor);
        return {
          view,
          resolveTarget,
          clearValue,
          storeOp: "store",
          loadOp
        };
      }
    );
    let depthStencilAttachment;
    if ((renderTarget.stencil || renderTarget.depth) && !renderTarget.depthStencilTexture) {
      renderTarget.ensureDepthStencilTexture();
      renderTarget.depthStencilTexture.source.sampleCount = gpuRenderTarget.msaa ? 4 : 1;
    }
    if (renderTarget.depthStencilTexture) {
      const stencilLoadOp = clear & gl_const/* CLEAR */.u.STENCIL ? "clear" : "load";
      const depthLoadOp = clear & gl_const/* CLEAR */.u.DEPTH ? "clear" : "load";
      depthStencilAttachment = {
        view: this._renderer.texture.getGpuSource(renderTarget.depthStencilTexture.source).createView(),
        stencilStoreOp: "store",
        stencilLoadOp,
        depthClearValue: 1,
        depthLoadOp,
        depthStoreOp: "store"
      };
    }
    const descriptor = {
      colorAttachments,
      depthStencilAttachment
    };
    return descriptor;
  }
  clear(renderTarget, clear = true, clearColor, viewport) {
    if (!clear)
      return;
    const { gpu, encoder } = this._renderer;
    const device = gpu.device;
    const standAlone = encoder.commandEncoder === null;
    if (standAlone) {
      const commandEncoder = device.createCommandEncoder();
      const renderPassDescriptor = this.getDescriptor(renderTarget, clear, clearColor);
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setViewport(viewport.x, viewport.y, viewport.width, viewport.height, 0, 1);
      passEncoder.end();
      const gpuCommands = commandEncoder.finish();
      device.queue.submit([gpuCommands]);
    } else {
      this.startRenderPass(renderTarget, clear, clearColor, viewport);
    }
  }
  initGpuRenderTarget(renderTarget) {
    renderTarget.isRoot = true;
    const gpuRenderTarget = new GpuRenderTarget();
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      if (colorTexture instanceof CanvasSource/* CanvasSource */.q) {
        const context = colorTexture.resource.getContext(
          "webgpu"
        );
        const alphaMode = colorTexture.transparent ? "premultiplied" : "opaque";
        try {
          context.configure({
            device: this._renderer.gpu.device,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            format: "bgra8unorm",
            alphaMode
          });
        } catch (e) {
          console.error(e);
        }
        gpuRenderTarget.contexts[i] = context;
      }
      gpuRenderTarget.msaa = colorTexture.source.antialias;
      if (colorTexture.source.antialias) {
        const msaaTexture = new TextureSource/* TextureSource */.v({
          width: 0,
          height: 0,
          sampleCount: 4
        });
        gpuRenderTarget.msaaTextures[i] = msaaTexture;
      }
    });
    if (gpuRenderTarget.msaa) {
      gpuRenderTarget.msaaSamples = 4;
      if (renderTarget.depthStencilTexture) {
        renderTarget.depthStencilTexture.source.sampleCount = 4;
      }
    }
    return gpuRenderTarget;
  }
  destroyGpuRenderTarget(gpuRenderTarget) {
    gpuRenderTarget.contexts.forEach((context) => {
      context.unconfigure();
    });
    gpuRenderTarget.msaaTextures.forEach((texture) => {
      texture.destroy();
    });
    gpuRenderTarget.msaaTextures.length = 0;
    gpuRenderTarget.contexts.length = 0;
  }
  ensureDepthStencilTexture(renderTarget) {
    const gpuRenderTarget = this._renderTargetSystem.getGpuRenderTarget(renderTarget);
    if (renderTarget.depthStencilTexture && gpuRenderTarget.msaa) {
      renderTarget.depthStencilTexture.source.sampleCount = 4;
    }
  }
  resizeGpuRenderTarget(renderTarget) {
    const gpuRenderTarget = this._renderTargetSystem.getGpuRenderTarget(renderTarget);
    gpuRenderTarget.width = renderTarget.width;
    gpuRenderTarget.height = renderTarget.height;
    if (gpuRenderTarget.msaa) {
      renderTarget.colorTextures.forEach((colorTexture, i) => {
        const msaaTexture = gpuRenderTarget.msaaTextures[i];
        msaaTexture?.resize(
          colorTexture.source.width,
          colorTexture.source.height,
          colorTexture.source._resolution
        );
      });
    }
  }
}


//# sourceMappingURL=GpuRenderTargetAdaptor.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/GpuRenderTargetSystem.mjs




"use strict";
class GpuRenderTargetSystem extends RenderTargetSystem/* RenderTargetSystem */.l {
  constructor(renderer) {
    super(renderer);
    this.adaptor = new GpuRenderTargetAdaptor();
    this.adaptor.init(renderer, this);
  }
}
/** @ignore */
GpuRenderTargetSystem.extension = {
  type: [Extensions/* ExtensionType */.Ag.WebGPUSystem],
  name: "renderTarget"
};


//# sourceMappingURL=GpuRenderTargetSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/shader/GpuShaderSystem.mjs


"use strict";
class GpuShaderSystem {
  constructor() {
    this._gpuProgramData = /* @__PURE__ */ Object.create(null);
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  getProgramData(program) {
    return this._gpuProgramData[program._layoutKey] || this._createGPUProgramData(program);
  }
  _createGPUProgramData(program) {
    const device = this._gpu.device;
    const bindGroups = program.gpuLayout.map((group) => device.createBindGroupLayout({ entries: group }));
    const pipelineLayoutDesc = { bindGroupLayouts: bindGroups };
    this._gpuProgramData[program._layoutKey] = {
      bindGroups,
      pipeline: device.createPipelineLayout(pipelineLayoutDesc)
    };
    return this._gpuProgramData[program._layoutKey];
  }
  destroy() {
    this._gpu = null;
    this._gpuProgramData = null;
  }
}
/** @ignore */
GpuShaderSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "shader"
};


//# sourceMappingURL=GpuShaderSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/state/GpuBlendModesToPixi.mjs

const GpuBlendModesToPixi = {};
GpuBlendModesToPixi.normal = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  }
};
GpuBlendModesToPixi.add = {
  alpha: {
    srcFactor: "src-alpha",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "add"
  }
};
GpuBlendModesToPixi.multiply = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "dst",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  }
};
GpuBlendModesToPixi.screen = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one-minus-src",
    operation: "add"
  }
};
GpuBlendModesToPixi.overlay = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one-minus-src",
    operation: "add"
  }
};
GpuBlendModesToPixi.none = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "zero",
    dstFactor: "zero",
    operation: "add"
  }
};
GpuBlendModesToPixi["normal-npm"] = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "src-alpha",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  }
};
GpuBlendModesToPixi["add-npm"] = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "add"
  },
  color: {
    srcFactor: "src-alpha",
    dstFactor: "one",
    operation: "add"
  }
};
GpuBlendModesToPixi["screen-npm"] = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "src-alpha",
    dstFactor: "one-minus-src",
    operation: "add"
  }
};
GpuBlendModesToPixi.erase = {
  alpha: {
    srcFactor: "zero",
    dstFactor: "one-minus-src-alpha",
    operation: "add"
  },
  color: {
    srcFactor: "zero",
    dstFactor: "one-minus-src",
    operation: "add"
  }
};
GpuBlendModesToPixi.min = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "min"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "min"
  }
};
GpuBlendModesToPixi.max = {
  alpha: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "max"
  },
  color: {
    srcFactor: "one",
    dstFactor: "one",
    operation: "max"
  }
};


//# sourceMappingURL=GpuBlendModesToPixi.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/state/GpuStateSystem.mjs




"use strict";
class GpuStateSystem {
  constructor() {
    this.defaultState = new State/* State */.U();
    this.defaultState.blend = true;
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  /**
   * Gets the blend mode data for the current state
   * @param state - The state to get the blend mode from
   */
  getColorTargets(state) {
    const blend = GpuBlendModesToPixi[state.blendMode] || GpuBlendModesToPixi.normal;
    return [
      {
        format: "bgra8unorm",
        writeMask: 0,
        blend
      }
    ];
  }
  destroy() {
    this.gpu = null;
  }
}
/** @ignore */
GpuStateSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "state"
};


//# sourceMappingURL=GpuStateSystem.mjs.map

// EXTERNAL MODULE: ./node_modules/pixi.js/lib/rendering/renderers/shared/texture/CanvasPool.mjs
var CanvasPool = __webpack_require__(7608);
;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadBufferImageResource.mjs

const gpuUploadBufferImageResource = {
  type: "image",
  upload(source, gpuTexture, gpu) {
    const resource = source.resource;
    const total = (source.pixelWidth | 0) * (source.pixelHeight | 0);
    const bytesPerPixel = resource.byteLength / total;
    gpu.device.queue.writeTexture(
      { texture: gpuTexture },
      resource,
      {
        offset: 0,
        rowsPerImage: source.pixelHeight,
        bytesPerRow: source.pixelHeight * bytesPerPixel
      },
      {
        width: source.pixelWidth,
        height: source.pixelHeight,
        depthOrArrayLayers: 1
      }
    );
  }
};


//# sourceMappingURL=gpuUploadBufferImageResource.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadCompressedTextureResource.mjs

const blockDataMap = {
  "bc1-rgba-unorm": { blockBytes: 8, blockWidth: 4, blockHeight: 4 },
  "bc2-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 },
  "bc3-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 },
  "bc7-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 },
  "etc1-rgb-unorm": { blockBytes: 8, blockWidth: 4, blockHeight: 4 },
  "etc2-rgba8unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 },
  "astc-4x4-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
};
const defaultBlockData = { blockBytes: 4, blockWidth: 1, blockHeight: 1 };
const gpuUploadCompressedTextureResource = {
  type: "compressed",
  upload(source, gpuTexture, gpu) {
    let mipWidth = source.pixelWidth;
    let mipHeight = source.pixelHeight;
    const blockData = blockDataMap[source.format] || defaultBlockData;
    for (let i = 0; i < source.resource.length; i++) {
      const levelBuffer = source.resource[i];
      const bytesPerRow = Math.ceil(mipWidth / blockData.blockWidth) * blockData.blockBytes;
      gpu.device.queue.writeTexture(
        {
          texture: gpuTexture,
          mipLevel: i
        },
        levelBuffer,
        {
          offset: 0,
          bytesPerRow
        },
        {
          width: Math.ceil(mipWidth / blockData.blockWidth) * blockData.blockWidth,
          height: Math.ceil(mipHeight / blockData.blockHeight) * blockData.blockHeight,
          depthOrArrayLayers: 1
        }
      );
      mipWidth = Math.max(mipWidth >> 1, 1);
      mipHeight = Math.max(mipHeight >> 1, 1);
    }
  }
};


//# sourceMappingURL=gpuUploadCompressedTextureResource.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadImageSource.mjs



"use strict";
const gpuUploadImageResource = {
  type: "image",
  upload(source, gpuTexture, gpu) {
    const resource = source.resource;
    if (!resource)
      return;
    if (globalThis.HTMLImageElement && resource instanceof HTMLImageElement) {
      const canvas = environment_adapter/* DOMAdapter */.e.get().createCanvas(resource.width, resource.height);
      const context = canvas.getContext("2d");
      context.drawImage(resource, 0, 0, resource.width, resource.height);
      source.resource = canvas;
      (0,warn/* warn */.R)("ImageSource: Image element passed, converting to canvas and replacing resource.");
    }
    const width = Math.min(gpuTexture.width, source.resourceWidth || source.pixelWidth);
    const height = Math.min(gpuTexture.height, source.resourceHeight || source.pixelHeight);
    const premultipliedAlpha = source.alphaMode === "premultiply-alpha-on-upload";
    gpu.device.queue.copyExternalImageToTexture(
      { source: resource },
      { texture: gpuTexture, premultipliedAlpha },
      {
        width,
        height
      }
    );
  }
};


//# sourceMappingURL=gpuUploadImageSource.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadVideoSource.mjs


"use strict";
const gpuUploadVideoResource = {
  type: "video",
  upload(source, gpuTexture, gpu) {
    gpuUploadImageResource.upload(source, gpuTexture, gpu);
  }
};


//# sourceMappingURL=gpuUploadVideoSource.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/utils/GpuMipmapGenerator.mjs

class GpuMipmapGenerator {
  constructor(device) {
    this.device = device;
    this.sampler = device.createSampler({ minFilter: "linear" });
    this.pipelines = {};
  }
  _getMipmapPipeline(format) {
    let pipeline = this.pipelines[format];
    if (!pipeline) {
      if (!this.mipmapShaderModule) {
        this.mipmapShaderModule = this.device.createShaderModule({
          code: (
            /* wgsl */
            `
                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

                        struct VertexOutput {
                        @builtin(position) position : vec4<f32>,
                        @location(0) texCoord : vec2<f32>,
                        };

                        @vertex
                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
                        var output : VertexOutput;
                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                        return output;
                        }

                        @group(0) @binding(0) var imgSampler : sampler;
                        @group(0) @binding(1) var img : texture_2d<f32>;

                        @fragment
                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
                        return textureSample(img, imgSampler, texCoord);
                        }
                    `
          )
        });
      }
      pipeline = this.device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module: this.mipmapShaderModule,
          entryPoint: "vertexMain"
        },
        fragment: {
          module: this.mipmapShaderModule,
          entryPoint: "fragmentMain",
          targets: [{ format }]
        }
      });
      this.pipelines[format] = pipeline;
    }
    return pipeline;
  }
  /**
   * Generates mipmaps for the given GPUTexture from the data in level 0.
   * @param {module:External.GPUTexture} texture - Texture to generate mipmaps for.
   * @returns {module:External.GPUTexture} - The originally passed texture
   */
  generateMipmap(texture) {
    const pipeline = this._getMipmapPipeline(texture.format);
    if (texture.dimension === "3d" || texture.dimension === "1d") {
      throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");
    }
    let mipTexture = texture;
    const arrayLayerCount = texture.depthOrArrayLayers || 1;
    const renderToSource = texture.usage & GPUTextureUsage.RENDER_ATTACHMENT;
    if (!renderToSource) {
      const mipTextureDescriptor = {
        size: {
          width: Math.ceil(texture.width / 2),
          height: Math.ceil(texture.height / 2),
          depthOrArrayLayers: arrayLayerCount
        },
        format: texture.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount: texture.mipLevelCount - 1
      };
      mipTexture = this.device.createTexture(mipTextureDescriptor);
    }
    const commandEncoder = this.device.createCommandEncoder({});
    const bindGroupLayout = pipeline.getBindGroupLayout(0);
    for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
      let srcView = texture.createView({
        baseMipLevel: 0,
        mipLevelCount: 1,
        dimension: "2d",
        baseArrayLayer: arrayLayer,
        arrayLayerCount: 1
      });
      let dstMipLevel = renderToSource ? 1 : 0;
      for (let i = 1; i < texture.mipLevelCount; ++i) {
        const dstView = mipTexture.createView({
          baseMipLevel: dstMipLevel++,
          mipLevelCount: 1,
          dimension: "2d",
          baseArrayLayer: arrayLayer,
          arrayLayerCount: 1
        });
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: dstView,
            storeOp: "store",
            loadOp: "clear",
            clearValue: { r: 0, g: 0, b: 0, a: 0 }
          }]
        });
        const bindGroup = this.device.createBindGroup({
          layout: bindGroupLayout,
          entries: [{
            binding: 0,
            resource: this.sampler
          }, {
            binding: 1,
            resource: srcView
          }]
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();
        srcView = dstView;
      }
    }
    if (!renderToSource) {
      const mipLevelSize = {
        width: Math.ceil(texture.width / 2),
        height: Math.ceil(texture.height / 2),
        depthOrArrayLayers: arrayLayerCount
      };
      for (let i = 1; i < texture.mipLevelCount; ++i) {
        commandEncoder.copyTextureToTexture({
          texture: mipTexture,
          mipLevel: i - 1
        }, {
          texture,
          mipLevel: i
        }, mipLevelSize);
        mipLevelSize.width = Math.ceil(mipLevelSize.width / 2);
        mipLevelSize.height = Math.ceil(mipLevelSize.height / 2);
      }
    }
    this.device.queue.submit([commandEncoder.finish()]);
    if (!renderToSource) {
      mipTexture.destroy();
    }
    return texture;
  }
}


//# sourceMappingURL=GpuMipmapGenerator.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/texture/GpuTextureSystem.mjs











"use strict";
class GpuTextureSystem {
  constructor(renderer) {
    this.managedTextures = [];
    this._gpuSources = /* @__PURE__ */ Object.create(null);
    this._gpuSamplers = /* @__PURE__ */ Object.create(null);
    this._bindGroupHash = /* @__PURE__ */ Object.create(null);
    this._textureViewHash = /* @__PURE__ */ Object.create(null);
    this._uploads = {
      image: gpuUploadImageResource,
      buffer: gpuUploadBufferImageResource,
      video: gpuUploadVideoResource,
      compressed: gpuUploadCompressedTextureResource
    };
    this._renderer = renderer;
    renderer.renderableGC.addManagedHash(this, "_gpuSources");
    renderer.renderableGC.addManagedHash(this, "_gpuSamplers");
    renderer.renderableGC.addManagedHash(this, "_bindGroupHash");
    renderer.renderableGC.addManagedHash(this, "_textureViewHash");
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  initSource(source) {
    if (source.autoGenerateMipmaps) {
      const biggestDimension = Math.max(source.pixelWidth, source.pixelHeight);
      source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
    }
    let usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    if (source.uploadMethodId !== "compressed") {
      usage |= GPUTextureUsage.RENDER_ATTACHMENT;
      usage |= GPUTextureUsage.COPY_SRC;
    }
    const blockData = blockDataMap[source.format] || { blockBytes: 4, blockWidth: 1, blockHeight: 1 };
    const width = Math.ceil(source.pixelWidth / blockData.blockWidth) * blockData.blockWidth;
    const height = Math.ceil(source.pixelHeight / blockData.blockHeight) * blockData.blockHeight;
    const textureDescriptor = {
      label: source.label,
      size: { width, height },
      format: source.format,
      sampleCount: source.sampleCount,
      mipLevelCount: source.mipLevelCount,
      dimension: source.dimension,
      usage
    };
    const gpuTexture = this._gpu.device.createTexture(textureDescriptor);
    this._gpuSources[source.uid] = gpuTexture;
    if (!this.managedTextures.includes(source)) {
      source.on("update", this.onSourceUpdate, this);
      source.on("resize", this.onSourceResize, this);
      source.on("destroy", this.onSourceDestroy, this);
      source.on("unload", this.onSourceUnload, this);
      source.on("updateMipmaps", this.onUpdateMipmaps, this);
      this.managedTextures.push(source);
    }
    this.onSourceUpdate(source);
    return gpuTexture;
  }
  onSourceUpdate(source) {
    const gpuTexture = this.getGpuSource(source);
    if (!gpuTexture)
      return;
    if (this._uploads[source.uploadMethodId]) {
      this._uploads[source.uploadMethodId].upload(source, gpuTexture, this._gpu);
    }
    if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
      this.onUpdateMipmaps(source);
    }
  }
  onSourceUnload(source) {
    const gpuTexture = this._gpuSources[source.uid];
    if (gpuTexture) {
      this._gpuSources[source.uid] = null;
      gpuTexture.destroy();
    }
  }
  onUpdateMipmaps(source) {
    if (!this._mipmapGenerator) {
      this._mipmapGenerator = new GpuMipmapGenerator(this._gpu.device);
    }
    const gpuTexture = this.getGpuSource(source);
    this._mipmapGenerator.generateMipmap(gpuTexture);
  }
  onSourceDestroy(source) {
    source.off("update", this.onSourceUpdate, this);
    source.off("unload", this.onSourceUnload, this);
    source.off("destroy", this.onSourceDestroy, this);
    source.off("resize", this.onSourceResize, this);
    source.off("updateMipmaps", this.onUpdateMipmaps, this);
    this.managedTextures.splice(this.managedTextures.indexOf(source), 1);
    this.onSourceUnload(source);
  }
  onSourceResize(source) {
    const gpuTexture = this._gpuSources[source.uid];
    if (!gpuTexture) {
      this.initSource(source);
    } else if (gpuTexture.width !== source.pixelWidth || gpuTexture.height !== source.pixelHeight) {
      this._textureViewHash[source.uid] = null;
      this._bindGroupHash[source.uid] = null;
      this.onSourceUnload(source);
      this.initSource(source);
    }
  }
  _initSampler(sampler) {
    this._gpuSamplers[sampler._resourceId] = this._gpu.device.createSampler(sampler);
    return this._gpuSamplers[sampler._resourceId];
  }
  getGpuSampler(sampler) {
    return this._gpuSamplers[sampler._resourceId] || this._initSampler(sampler);
  }
  getGpuSource(source) {
    return this._gpuSources[source.uid] || this.initSource(source);
  }
  /**
   * this returns s bind group for a specific texture, the bind group contains
   * - the texture source
   * - the texture style
   * - the texture matrix
   * This is cached so the bind group should only be created once per texture
   * @param texture - the texture you want the bindgroup for
   * @returns the bind group for the texture
   */
  getTextureBindGroup(texture) {
    return this._bindGroupHash[texture.uid] ?? this._createTextureBindGroup(texture);
  }
  _createTextureBindGroup(texture) {
    const source = texture.source;
    this._bindGroupHash[texture.uid] = new BindGroup/* BindGroup */.T({
      0: source,
      1: source.style,
      2: new UniformGroup/* UniformGroup */.k({
        uTextureMatrix: { type: "mat3x3<f32>", value: texture.textureMatrix.mapCoord }
      })
    });
    return this._bindGroupHash[texture.uid];
  }
  getTextureView(texture) {
    const source = texture.source;
    return this._textureViewHash[source.uid] ?? this._createTextureView(source);
  }
  _createTextureView(texture) {
    this._textureViewHash[texture.uid] = this.getGpuSource(texture).createView();
    return this._textureViewHash[texture.uid];
  }
  generateCanvas(texture) {
    const renderer = this._renderer;
    const commandEncoder = renderer.gpu.device.createCommandEncoder();
    const canvas = environment_adapter/* DOMAdapter */.e.get().createCanvas();
    canvas.width = texture.source.pixelWidth;
    canvas.height = texture.source.pixelHeight;
    const context = canvas.getContext("webgpu");
    context.configure({
      device: renderer.gpu.device,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
      format: environment_adapter/* DOMAdapter */.e.get().getNavigator().gpu.getPreferredCanvasFormat(),
      alphaMode: "premultiplied"
    });
    commandEncoder.copyTextureToTexture({
      texture: renderer.texture.getGpuSource(texture.source),
      origin: {
        x: 0,
        y: 0
      }
    }, {
      texture: context.getCurrentTexture()
    }, {
      width: canvas.width,
      height: canvas.height
    });
    renderer.gpu.device.queue.submit([commandEncoder.finish()]);
    return canvas;
  }
  getPixels(texture) {
    const webGPUCanvas = this.generateCanvas(texture);
    const canvasAndContext = CanvasPool/* CanvasPool */.N.getOptimalCanvasAndContext(webGPUCanvas.width, webGPUCanvas.height);
    const context = canvasAndContext.context;
    context.drawImage(webGPUCanvas, 0, 0);
    const { width, height } = webGPUCanvas;
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = new Uint8ClampedArray(imageData.data.buffer);
    CanvasPool/* CanvasPool */.N.returnCanvasAndContext(canvasAndContext);
    return { pixels, width, height };
  }
  destroy() {
    this.managedTextures.slice().forEach((source) => this.onSourceDestroy(source));
    this.managedTextures = null;
    for (const k of Object.keys(this._bindGroupHash)) {
      const key = Number(k);
      const bindGroup = this._bindGroupHash[key];
      bindGroup?.destroy();
      this._bindGroupHash[key] = null;
    }
    this._gpu = null;
    this._mipmapGenerator = null;
    this._gpuSources = null;
    this._bindGroupHash = null;
    this._textureViewHash = null;
    this._gpuSamplers = null;
  }
}
/** @ignore */
GpuTextureSystem.extension = {
  type: [
    Extensions/* ExtensionType */.Ag.WebGPUSystem
  ],
  name: "texture"
};


//# sourceMappingURL=GpuTextureSystem.mjs.map

;// ./node_modules/pixi.js/lib/rendering/renderers/gpu/WebGPURenderer.mjs






















"use strict";
const DefaultWebGPUSystems = [
  ...SharedSystems/* SharedSystems */.i,
  GpuUboSystem,
  GpuEncoderSystem,
  GpuDeviceSystem,
  GpuLimitsSystem,
  GpuBufferSystem,
  GpuTextureSystem,
  GpuRenderTargetSystem,
  GpuShaderSystem,
  GpuStateSystem,
  PipelineSystem,
  GpuColorMaskSystem,
  GpuStencilSystem,
  BindGroupSystem
];
const DefaultWebGPUPipes = [...SharedSystems/* SharedRenderPipes */.f, GpuUniformBatchPipe];
const DefaultWebGPUAdapters = [GpuBatchAdaptor, GpuMeshAdapter, GpuGraphicsAdaptor];
const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];
Extensions/* extensions */.XO.handleByNamedList(Extensions/* ExtensionType */.Ag.WebGPUSystem, systems);
Extensions/* extensions */.XO.handleByNamedList(Extensions/* ExtensionType */.Ag.WebGPUPipes, renderPipes);
Extensions/* extensions */.XO.handleByNamedList(Extensions/* ExtensionType */.Ag.WebGPUPipesAdaptor, renderPipeAdaptors);
Extensions/* extensions */.XO.add(...DefaultWebGPUSystems, ...DefaultWebGPUPipes, ...DefaultWebGPUAdapters);
class WebGPURenderer extends AbstractRenderer/* AbstractRenderer */.k {
  constructor() {
    const systemConfig = {
      name: "webgpu",
      type: types/* RendererType */.W.WEBGPU,
      systems,
      renderPipes,
      renderPipeAdaptors
    };
    super(systemConfig);
  }
}


//# sourceMappingURL=WebGPURenderer.mjs.map


/***/ })

}]);