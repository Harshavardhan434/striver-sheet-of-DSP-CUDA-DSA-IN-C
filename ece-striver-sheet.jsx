import { useState, useEffect, useRef } from "react";

const TRACKS = {
  DSP: {
    label: "DSP",
    full: "Digital Signal Processing",
    color: "#00FFB2",
    dim: "#00FFB240",
    glow: "0 0 12px #00FFB280",
    icon: "〜",
    days: [
      { day: 1, topic: "Signals & System Fundamentals", concept: "Foundation", tasks: ["Continuous vs Discrete-time signals", "Unit step u[n], impulse δ[n], ramp r[n]", "Signal energy E = Σ|x[n]|²  and power", "NumPy: linspace, arange, signal plotting with matplotlib"] },
      { day: 2, topic: "LTI Systems & Convolution", concept: "Core Operation", tasks: ["Linearity + Time-Invariance proof", "Discrete convolution: y[n] = x[n] * h[n]", "np.convolve() hands-on", "FIR filter as convolution intuition"] },
      { day: 3, topic: "Fourier Series", concept: "Freq Domain", tasks: ["Orthogonality of sinusoids", "Euler's formula: e^{jθ} = cosθ + j·sinθ", "FS coefficient computation", "Gibbs phenomenon visualization"] },
      { day: 4, topic: "DTFT & DFT", concept: "Transform", tasks: ["DTFT definition and periodicity", "DFT: X[k] = Σ x[n] e^{-j2πkn/N}", "DFT matrix intuition", "np.fft.fft() and frequency bins"] },
      { day: 5, topic: "FFT Algorithm", concept: "Efficiency", tasks: ["Cooley-Tukey butterfly diagram", "O(N log N) vs O(N²) DFT", "Zero-padding for frequency resolution", "Spectral leakage problem"] },
      { day: 6, topic: "Windowing Functions", concept: "Leakage Control", tasks: ["Rectangular, Hanning, Hamming, Blackman", "Main lobe width vs side lobe level trade-off", "scipy.signal.get_window()", "Windowing before FFT — when & why"] },
      { day: 7, topic: "Z-Transform", concept: "Z-Domain", tasks: ["Definition & Region of Convergence (ROC)", "Poles & zeros — stability condition |poles| < 1", "Inverse Z-transform (partial fractions)", "Relation: Z-transform → DTFT on unit circle"] },
      { day: 8, topic: "FIR Filter Design", concept: "FIR", tasks: ["Window method: h[n] = hd[n]·w[n]", "scipy.signal.firwin() — LPF, HPF, BPF", "freqz() — frequency response plot", "Linear phase property of FIR"] },
      { day: 9, topic: "IIR Filter Design", concept: "IIR", tasks: ["Butterworth, Chebyshev, Elliptic types", "Bilinear transform: s = 2/T · (z-1)/(z+1)", "scipy.signal.butter() + sosfilt()", "Phase distortion in IIR vs FIR"] },
      { day: 10, topic: "Sampling & Nyquist Theorem", concept: "Sampling", tasks: ["Nyquist rate = 2 × f_max", "Aliasing demonstration", "Decimation & interpolation", "scipy.signal.resample() and polyphase filters"] },
      { day: 11, topic: "STFT & Spectrogram", concept: "Time-Freq", tasks: ["Short-Time Fourier Transform definition", "Window overlap & hop size parameters", "scipy.signal.stft() on audio", "Spectrogram: time vs frequency vs magnitude"] },
      { day: 12, topic: "Wavelets Introduction", concept: "Wavelets", tasks: ["CWT vs DWT — when to use which", "Haar wavelet — simplest wavelet", "PyWavelets (pywt) library basics", "Multiresolution analysis (MRA) concept"] },
      { day: 13, topic: "Power Spectral Density", concept: "PSD", tasks: ["Periodogram: |X[k]|²/N", "Welch's method — averaged PSD", "scipy.signal.welch()", "Noise floor analysis in ECE signals"] },
      { day: 14, topic: "Correlation & Matched Filter", concept: "Detection", tasks: ["Cross-correlation vs convolution", "Autocorrelation function R[l]", "Matched filter: maximize SNR", "Radar / SONAR echo detection"] },
      { day: 15, topic: "Adaptive Filters — LMS", concept: "Adaptive", tasks: ["Wiener filter optimal solution", "LMS algorithm: w[n+1] = w[n] + μ·e[n]·x[n]", "Convergence condition: 0 < μ < 2/λ_max", "Noise cancellation demo"] },
      { day: 16, topic: "Multirate DSP", concept: "Multirate", tasks: ["Upsampling by L — insert zeros", "Downsampling by M — decimate", "Polyphase decomposition", "Sample-rate conversion (e.g. 44.1→48 kHz)"] },
      { day: 17, topic: "Digital Oscillator & NCO", concept: "Synthesis", tasks: ["CORDIC algorithm basics", "Numerically Controlled Oscillator (NCO)", "Direct Digital Synthesis (DDS)", "Phase accumulator + LUT implementation"] },
      { day: 18, topic: "Quantization & Fixed-Point", concept: "Hardware", tasks: ["Uniform quantization: Δ = (x_max - x_min)/2^B", "SQNR = 6.02B + 1.76 dB", "Fixed-point overflow and saturation", "Q-format arithmetic (Q15, Q31)"] },
      { day: 19, topic: "DSP on ECE Hardware", concept: "Applied", tasks: ["ADC/DAC pipeline: sample → quantize → process → reconstruct", "Anti-aliasing filter before ADC", "Reconstruction filter after DAC", "DSP vs MCU vs FPGA trade-offs"] },
      { day: 20, topic: "OFDM Modulation Basics", concept: "Comms", tasks: ["Orthogonal subcarriers: Δf = 1/T", "IFFT at transmitter, FFT at receiver", "Cyclic prefix (CP) — remove ISI", "OFDM in LTE / Wi-Fi / 5G NR"] },
      { day: 21, topic: "Kalman Filter Introduction", concept: "Estimation", tasks: ["State-space model: x[k+1] = Ax[k] + Bu[k] + w[k]", "Prediction step & update step", "Kalman gain computation", "1D Kalman filter Python implementation"] },
      { day: 22, topic: "Beamforming & Array DSP", concept: "Spatial", tasks: ["Uniform Linear Array (ULA) geometry", "Delay-and-sum beamforming", "Spatial frequency & wavenumber k", "MUSIC algorithm intro for DOA"] },
      { day: 23, topic: "DSP with SciPy — Deep Dive", concept: "Library", tasks: ["scipy.signal full module tour", "chirp, gausspulse, sweep_poly generators", "sosfilt vs lfilter numerical stability", "Signal design for ECE lab projects"] },
      { day: 24, topic: "Real-Time DSP Concepts", concept: "Real-Time", tasks: ["Block processing vs sample-by-sample", "Latency analysis: input → compute → output", "PyAudio for real-time audio DSP", "Circular buffer implementation"] },
      { day: 25, topic: "Image Processing as 2D DSP", concept: "2D-DSP", tasks: ["2D DFT: F(u,v) = ΣΣ f(x,y) e^{...}", "2D convolution with kernels", "Edge detection: Sobel, Laplacian", "scipy.ndimage and OpenCV basics"] },
      { day: 26, topic: "DSP Project — Audio Equalizer", concept: "Project", tasks: ["Design 5-band graphic equalizer", "Cascade IIR biquad sections", "Real-time PyAudio processing loop", "Plot frequency response of full system"] },
      { day: 27, topic: "DSP Project — BPSK Modem", concept: "Project", tasks: ["BPSK modulation & demodulation", "Raised-cosine pulse shaping", "Matched filter at receiver", "BER vs Eb/N0 simulation"] },
      { day: 28, topic: "DSP Project — ECG Analysis", concept: "Project", tasks: ["Load ECG signal (wfdb library / MIT-BIH)", "Baseline wander removal (HPF)", "R-peak detection (Pan-Tompkins)", "Heart rate variability (HRV) analysis"] },
      { day: 29, topic: "Compressive Sensing Intro", concept: "Advanced", tasks: ["Sparsity in transform domain", "RIP (Restricted Isometry Property)", "LASSO / basis pursuit recovery", "Applications: MRI, radar, IoT sensors"] },
      { day: 30, topic: "DSP System Design Capstone", concept: "Capstone", tasks: ["End-to-end DSP pipeline design", "Requirements → algorithm → implementation → test", "Documentation: block diagram + math + code", "Profile and optimize for hardware target"] },
    ]
  },
  "Adv Python": {
    label: "Adv Python",
    full: "Advanced Python",
    color: "#FFD93D",
    dim: "#FFD93D40",
    glow: "0 0 12px #FFD93D80",
    icon: "⟁",
    days: [
      { day: 1, topic: "Iterators & Generators Protocol", concept: "Iteration", tasks: ["__iter__ & __next__ — writing custom iterators", "yield vs return — generator functions", "Generator expressions vs list comprehensions", "Infinite generators: count(), cycle(), repeat()"] },
      { day: 2, topic: "Decorators — Full Mastery", concept: "Meta-prog", tasks: ["First-class functions: passing & returning", "functools.wraps — preserving metadata", "Decorator factories (decorator with args)", "Class-based decorators with __call__"] },
      { day: 3, topic: "Context Managers", concept: "Resource Mgmt", tasks: ["__enter__ & __exit__ protocol", "@contextlib.contextmanager with yield", "Nested context managers (ExitStack)", "Async context managers: async with"] },
      { day: 4, topic: "Metaclasses", concept: "Meta-prog", tasks: ["Everything is an object — type() as metaclass", "Custom metaclass: class Meta(type)", "__new__ vs __init__ in metaclasses", "Real use: ORMs, plugin registries, ABCMeta"] },
      { day: 5, topic: "Descriptors", concept: "OOP Internals", tasks: ["__get__, __set__, __delete__ protocol", "Data vs non-data descriptors", "Property is a descriptor — internals", "Lazy attribute loading with descriptors"] },
      { day: 6, topic: "Slots & Memory Optimization", concept: "Memory", tasks: ["__slots__ vs __dict__ memory layout", "Memory profiling with tracemalloc", "pympler.asizeof — object sizes", "When to use slots (high-count objects)"] },
      { day: 7, topic: "Abstract Classes & Protocols", concept: "Type System", tasks: ["abc.ABC + @abstractmethod", "Structural subtyping with Protocol (PEP 544)", "runtime_checkable protocols", "Protocol vs ABC — when to use which"] },
      { day: 8, topic: "Dataclasses & Attrs", concept: "Data Modeling", tasks: ["@dataclass: field(), default_factory", "frozen=True for immutability", "__post_init__ for validation", "attrs library — slots=True performance"] },
      { day: 9, topic: "Type Hints — Advanced", concept: "Typing", tasks: ["TypeVar, Generic[T], covariance/contravariance", "ParamSpec for decorator typing", "Annotated[T, metadata] — PEP 593", "mypy strict mode — catching real bugs"] },
      { day: 10, topic: "Threading & GIL", concept: "Concurrency", tasks: ["GIL — why it exists, what it prevents", "threading.Thread, Lock, RLock", "ThreadPoolExecutor — I/O-bound work", "Thread-safe queue: queue.Queue"] },
      { day: 11, topic: "Asyncio Deep Dive", concept: "Async", tasks: ["Event loop internals — selector, callbacks", "async def, await, coroutine objects", "asyncio.gather(), create_task(), shield()", "aiohttp: async HTTP requests"] },
      { day: 12, topic: "Multiprocessing", concept: "Parallelism", tasks: ["Process vs Thread — memory isolation", "multiprocessing.Pool: map, starmap", "Shared memory: Value, Array, Manager", "CPU-bound parallelism — bypassing GIL"] },
      { day: 13, topic: "NumPy Internals & Vectorization", concept: "NumPy", tasks: ["Strides & memory layout (C vs Fortran order)", "Broadcasting rules — shape compatibility", "np.einsum() — powerful subscript notation", "Avoid Python loops — vectorize everything"] },
      { day: 14, topic: "Numba JIT Compilation", concept: "Speed", tasks: ["@numba.jit vs @numba.njit (nopython)", "Type inference — how Numba works", "@numba.vectorize for ufuncs", "Numba performance: benchmark vs NumPy"] },
      { day: 15, topic: "Cython Basics", concept: "Speed", tasks: ["cdef, cpdef, cimport keywords", "Type annotations for C speed", "Wrapping C code with Cython", "Build with setup.py / pyximport"] },
      { day: 16, topic: "ctypes — Python↔C Bridge", concept: "C-Interop", tasks: ["ctypes.CDLL — loading shared libraries", "C struct mapping with Structure", "Pointer arithmetic via ctypes.POINTER", "Call optimized C DSP routines from Python"] },
      { day: 17, topic: "cffi — Modern C Interop", concept: "C-Interop", tasks: ["cffi ABI vs API mode", "ffi.cdef() — declare C signatures", "ffi.dlopen() — load library", "cffi vs ctypes — when to prefer which"] },
      { day: 18, topic: "Python C Extension Module", concept: "Extension", tasks: ["PyObject* — everything is an object", "PyArg_ParseTuple — argument parsing", "Py_INCREF / Py_DECREF — reference counting", "Build & import custom .so extension"] },
      { day: 19, topic: "Memory Management & GC", concept: "Internals", tasks: ["Reference counting — how CPython tracks objects", "gc module — cyclic garbage collection", "weakref — avoid reference cycles", "Memory leak debugging with objgraph"] },
      { day: 20, topic: "Profiling & Benchmarking", concept: "Performance", tasks: ["cProfile + pstats — function-level profiling", "line_profiler @profile decorator", "py-spy — sampling profiler (zero overhead)", "timeit — microbenchmark correctly"] },
      { day: 21, topic: "Functional Programming", concept: "Functional", tasks: ["map, filter, functools.reduce", "functools.partial — partial application", "itertools — combinatoric generators", "toolz / cytoolz for FP pipelines"] },
      { day: 22, topic: "Packaging & Project Structure", concept: "Engineering", tasks: ["pyproject.toml (PEP 517/518)", "src layout vs flat layout", "Publish to PyPI — twine, build", "Dependency pinning: pip-tools, poetry"] },
      { day: 23, topic: "Testing — pytest Advanced", concept: "Quality", tasks: ["Fixtures — scope: function/class/module/session", "Parametrize — test matrix", "Mocking with pytest-mock / unittest.mock", "Coverage: pytest-cov — hitting edge cases"] },
      { day: 24, topic: "Async Patterns & Trio", concept: "Async", tasks: ["Structured concurrency — Trio nurseries", "anyio — backend-agnostic async", "Async generators", "Backpressure & flow control patterns"] },
      { day: 25, topic: "Python for DSP Integration", concept: "ECE Bridge", tasks: ["SciPy + Numba for fast signal processing", "Python ↔ CUDA via PyCUDA / CuPy", "Wrapping C DSP library with cffi", "Real-time pipeline: generator → filter → output"] },
      { day: 26, topic: "Data Pipelines & Dask", concept: "Big Data", tasks: ["Dask arrays — lazy NumPy on large data", "Dask delayed — task graph computation", "Dask distributed — multi-machine", "Processing large ECG/radar datasets"] },
      { day: 27, topic: "Python AST & Code Generation", concept: "Advanced", tasks: ["ast.parse() — inspect Python source", "ast.NodeTransformer — rewrite code", "compile() + exec() — runtime code gen", "Building a mini DSL with Python AST"] },
      { day: 28, topic: "Design Patterns in Python", concept: "Patterns", tasks: ["Observer — event-driven signal processing", "Strategy — swappable filter algorithms", "Factory — hardware abstraction", "Flyweight — reduce memory in DSP buffers"] },
      { day: 29, topic: "Pydantic & Validation", concept: "Data", tasks: ["BaseModel — typed data validation", "Field validators & model validators", "Pydantic v2 — Rust-based core speed", "Config management: pydantic-settings"] },
      { day: 30, topic: "Advanced Python Capstone", concept: "Capstone", tasks: ["Build a DSP library in Python + C extensions", "Type-annotated, tested, packaged", "Numba-accelerated core + Python API", "Benchmark: pure Python vs NumPy vs Numba vs C"] },
    ]
  },
  CUDA: {
    label: "CUDA",
    full: "CUDA GPU Programming",
    color: "#76C7F5",
    dim: "#76C7F540",
    glow: "0 0 12px #76C7F580",
    icon: "⬡",
    days: [
      { day: 1, topic: "GPU Architecture Deep Dive", concept: "Architecture", tasks: ["SM (Streaming Multiprocessor) anatomy", "CUDA cores vs Tensor Cores vs RT Cores", "L1/L2 cache, shared mem, registers", "GPU generations: Volta → Ampere → Hopper"] },
      { day: 2, topic: "CUDA Programming Model", concept: "Model", tasks: ["Grid → Block → Warp → Thread hierarchy", "threadIdx, blockIdx, blockDim, gridDim", "Hello World kernel — write & compile", "nvcc compilation flags: -arch sm_XX"] },
      { day: 3, topic: "Thread Indexing & Mapping", concept: "Indexing", tasks: ["1D, 2D, 3D grid/block configurations", "Global thread ID: i = blockIdx.x*blockDim.x + threadIdx.x", "Mapping threads to array elements", "Boundary checks: if (i < N)"] },
      { day: 4, topic: "CUDA Memory Model", concept: "Memory", tasks: ["cudaMalloc, cudaMemcpy (H2D, D2H), cudaFree", "Unified Memory: cudaMallocManaged", "Pinned memory: cudaMallocHost — faster transfers", "PCIe bandwidth calculation"] },
      { day: 5, topic: "Shared Memory & Tiling", concept: "Shared Mem", tasks: ["__shared__ keyword declaration", "__syncthreads() barrier", "Bank conflicts — how to avoid", "Tiled matrix multiply — classic example"] },
      { day: 6, topic: "Memory Coalescing", concept: "Optimization", tasks: ["Coalesced vs strided global memory access", "128-byte transaction line", "SoA vs AoS — memory layout impact", "Profiling memory efficiency with Nsight"] },
      { day: 7, topic: "Warp-Level Programming", concept: "Warp", tasks: ["Warp = 32 threads execute in lockstep", "Warp divergence — branch penalties", "__shfl_xor_sync, __ballot_sync intrinsics", "Warp-level reduction pattern"] },
      { day: 8, topic: "Parallel Reduction", concept: "Patterns", tasks: ["Naive reduction — divergence problem", "Interleaved vs sequential addressing", "Warp shuffle reduction (fastest)", "atomicAdd for final accumulation"] },
      { day: 9, topic: "Atomic Operations", concept: "Synchronization", tasks: ["atomicAdd, atomicMax, atomicCAS", "Lock-based vs lock-free with atomics", "Atomic performance vs shared memory reduction", "When to use atomics (histogram, scatter)"] },
      { day: 10, topic: "CUDA Streams & Concurrency", concept: "Streams", tasks: ["cudaStream_t creation & destruction", "Async copies: cudaMemcpyAsync()", "Overlap compute & H2D/D2H transfer", "Multi-stream depth diagram"] },
      { day: 11, topic: "Occupancy & Roofline", concept: "Analysis", tasks: ["Occupancy = active warps / max warps per SM", "Occupancy calculator tool", "Roofline model: compute-bound vs memory-bound", "Arithmetic Intensity: FLOPs / bytes"] },
      { day: 12, topic: "Nsight Profiling Workflow", concept: "Profiling", tasks: ["Nsight Systems — timeline view (CPU+GPU)", "Nsight Compute — kernel-level metrics", "Key metrics: SM efficiency, memory throughput", "Iterative profiling → optimize cycle"] },
      { day: 13, topic: "cuBLAS — GPU BLAS", concept: "Libraries", tasks: ["cublasCreate() handle setup", "cublasSgemm() — matrix multiply", "cuBLAS Level 1/2/3 operation categories", "In-place vs out-of-place operations"] },
      { day: 14, topic: "cuFFT — GPU FFT", concept: "Libraries", tasks: ["cufftPlan1d(), cufftPlan2d()", "cufftExecC2C() — complex-to-complex", "Batched FFT: process N signals in parallel", "cuFFT vs CPU FFTW performance"] },
      { day: 15, topic: "Texture & Constant Memory", concept: "Cache", tasks: ["Texture cache — 2D spatial locality", "tex1Dfetch() and texture objects", "__constant__ memory — broadcast reads", "Read-only cache: __ldg() intrinsic"] },
      { day: 16, topic: "Dynamic Parallelism", concept: "Advanced", tasks: ["Kernel launching kernels from device", "Parent-child synchronization", "cudaDeviceSynchronize() from device", "Recursive algorithms on GPU (quicksort)"] },
      { day: 17, topic: "Tensor Cores — WMMA API", concept: "Tensor Cores", tasks: ["WMMA: wmma::fragment types", "wmma::load_matrix_sync, wmma::mma_sync", "FP16 input, FP32 accumulate", "Understand why 16×16×16 tile size"] },
      { day: 18, topic: "Mixed Precision Training", concept: "ML Hardware", tasks: ["FP32 vs FP16 vs BF16 trade-offs", "Loss scaling to prevent underflow", "cuBLAS mixed precision gemm", "Automatic Mixed Precision (AMP) concept"] },
      { day: 19, topic: "CuPy — GPU NumPy", concept: "Python-CUDA", tasks: ["cupy.array() — GPU ndarray", "All NumPy ops on GPU via CuPy", "cupy.RawKernel() — custom CUDA from Python", "CuPy DSP: GPU FFT, filtering"] },
      { day: 20, topic: "PyCUDA & Numba CUDA", concept: "Python-CUDA", tasks: ["PyCUDA: SourceModule + get_function()", "Numba @cuda.jit kernel writing", "Numba cuda.shared.array()", "Compare PyCUDA vs Numba CUDA ergonomics"] },
      { day: 21, topic: "Thrust — CUDA STL", concept: "C++ CUDA", tasks: ["thrust::device_vector operations", "thrust::transform, reduce, sort", "Thrust fancy iterators", "Thrust vs manual kernels — when to use"] },
      { day: 22, topic: "Multi-GPU Programming", concept: "Scaling", tasks: ["cudaSetDevice(N) — select GPU", "Peer-to-peer cudaMemcpyPeer()", "NVLink vs PCIe bandwidth", "NCCL: allreduce, broadcast for DL"] },
      { day: 23, topic: "CUDA Graphs", concept: "Advanced", tasks: ["Graph capture: cudaStreamBeginCapture", "cudaGraphInstantiate & cudaGraphLaunch", "Reduce kernel launch overhead", "CUDA Graphs for inference pipelines"] },
      { day: 24, topic: "GPU-Accelerated DSP Pipeline", concept: "ECE Project", tasks: ["Batch FFT on GPU: cuFFT", "GPU FIR filter kernel", "GPU spectrogram computation", "CPU vs GPU throughput benchmark"] },
      { day: 25, topic: "Sparse Matrix Operations", concept: "cuSPARSE", tasks: ["CSR format: values, col_indices, row_ptr", "cusparseSpMV() — SpMV operation", "Sparse FFT applications", "Compressed sensing on GPU"] },
      { day: 26, topic: "CUDA Debugging", concept: "Debugging", tasks: ["cuda-gdb workflow", "Compute Sanitizer (memcheck, racecheck)", "printf in kernels — debugging aid", "Trap on out-of-bounds: CUDA_LAUNCH_BLOCKING=1"] },
      { day: 27, topic: "PTX & SASS Assembly", concept: "Low-Level", tasks: ["PTX — portable assembly layer", "SASS — actual GPU machine code", "Inspecting PTX: nvcc -ptx", "mma.sync.aligned PTX instruction"] },
      { day: 28, topic: "GPU Memory Allocators", concept: "Advanced", tasks: ["cudaMallocAsync + memory pools", "rmm (RAPIDS Memory Manager)", "Arena allocator on GPU", "Fragmentation and pooling strategy"] },
      { day: 29, topic: "Real-Time GPU Signal Processing", concept: "Applied", tasks: ["Low-latency pipeline: zero-copy memory", "GPU Direct for network→GPU direct", "CUDA streams for pipeline stages", "Latency analysis: CPU vs GPU signal path"] },
      { day: 30, topic: "CUDA Capstone Project", concept: "Capstone", tasks: ["Implement GPU-accelerated beamforming", "Multi-stream FFT + filter pipeline", "Profile with Nsight and optimize", "Document: kernel design + perf report"] },
    ]
  },
  "Adv C": {
    label: "Adv C",
    full: "Advanced C Programming",
    color: "#FF6B6B",
    dim: "#FF6B6B40",
    glow: "0 0 12px #FF6B6B80",
    icon: "◈",
    days: [
      { day: 1, topic: "C Memory Model Internals", concept: "Memory", tasks: ["Stack vs Heap vs BSS vs Data vs Text segments", "nm tool — inspect symbols in binary", "struct padding: __attribute__((packed))", "sizeof, alignof, offsetof macros"] },
      { day: 2, topic: "Pointer Mastery", concept: "Pointers", tasks: ["Pointer arithmetic: ptr + n = ptr + n×sizeof(*ptr)", "Double pointers: char **argv pattern", "Function pointers: int (*fn)(int, int)", "void* — generic pointer & casting rules"] },
      { day: 3, topic: "Dynamic Memory Internals", concept: "Memory Mgmt", tasks: ["glibc malloc internals: bins, arenas", "Fragmentation: internal vs external", "valgrind --leak-check=full workflow", "Custom pool allocator implementation"] },
      { day: 4, topic: "Bitwise Operations & Bit Tricks", concept: "Bits", tasks: ["Set/clear/toggle/check bit macros", "Bit fields in structs: uint8_t flags:3", "Bitmask flags pattern (Unix permissions)", "Brian Kernighan's popcount, Hamming weight"] },
      { day: 5, topic: "C Preprocessor Deep Dive", concept: "Macros", tasks: ["X-Macros pattern — DRY enum+string tables", "Variadic macros: #define LOG(fmt, ...) ...", "_Static_assert(sizeof(int)==4, \"msg\")", "Token pasting ## and stringification #"] },
      { day: 6, topic: "C11 Standard Features", concept: "Modern C", tasks: ["_Generic — type-generic macros", "_Atomic + stdatomic.h (atomic_int, etc.)", "_Alignas(16) for SIMD alignment", "Anonymous structs & unions"] },
      { day: 7, topic: "Function Pointers & Dispatch Tables", concept: "Patterns", tasks: ["Dispatch table: fn_ptr table[] = {add, sub, mul}", "State machine via function pointer arrays", "Callbacks in qsort, bsearch, signal()", "Simulating OOP vtable in C"] },
      { day: 8, topic: "POSIX System Calls", concept: "Systems", tasks: ["open/read/write/close — unbuffered I/O", "mmap() — memory-mapped file access", "poll/epoll — scalable I/O multiplexing", "fork() + exec() process model"] },
      { day: 9, topic: "POSIX Threads (pthreads)", concept: "Concurrency", tasks: ["pthread_create, pthread_join, pthread_exit", "Mutex: pthread_mutex_lock/unlock", "Condition variables: wait + signal + broadcast", "Reader-writer lock: pthread_rwlock_t"] },
      { day: 10, topic: "SIMD Intrinsics (SSE/AVX)", concept: "SIMD", tasks: ["__m256 — 8 floats in one AVX register", "_mm256_add_ps, _mm256_mul_ps operations", "SIMD dot product — vectorized inner loop", "SIMD vs scalar: benchmark with perf"] },
      { day: 11, topic: "Inline Assembly", concept: "Low-Level", tasks: ["GCC asm volatile (\"\" : output : input : clobbers)", "Register constraints: \"r\", \"m\", \"=r\"", "RDTSC — read CPU cycle counter", "Memory barrier: asm volatile(\"\" ::: \"memory\")"] },
      { day: 12, topic: "Compiler & Linker Internals", concept: "Toolchain", tasks: ["Compilation stages: cpp → cc1 → as → ld", "ELF format: .text .data .bss .rodata sections", "Weak vs strong symbols — linker resolution", "LTO: Link-Time Optimization (-flto)"] },
      { day: 13, topic: "GCC Optimization Flags", concept: "Optimization", tasks: ["-O0 vs -O2 vs -O3 vs -Ofast — trade-offs", "restrict keyword — alias analysis hint", "likely/unlikely branch hints", "Profile-Guided Optimization (PGO) workflow"] },
      { day: 14, topic: "Memory-Mapped I/O", concept: "Embedded", tasks: ["volatile — prevent compiler optimization of MMIO", "Peripheral register access via struct + pointer cast", "Memory barriers before/after MMIO", "DMA concept: CPU sets up, hardware does transfer"] },
      { day: 15, topic: "Lock-Free Programming", concept: "Advanced", tasks: ["CAS: compare_exchange_strong / weak", "ABA problem — how to avoid", "Memory orderings: relaxed, acquire, release, seq_cst", "Lock-free MPSC queue design"] },
      { day: 16, topic: "Networking in C (BSD Sockets)", concept: "Networking", tasks: ["socket() → bind() → listen() → accept() flow", "send() / recv() — TCP streaming", "Non-blocking sockets: fcntl(O_NONBLOCK)", "epoll_wait() — handle 10K connections"] },
      { day: 17, topic: "Error Handling Patterns", concept: "Robustness", tasks: ["errno + strerror() + perror()", "goto pattern for cleanup on error", "setjmp / longjmp — structured exception-like", "Defensive: assert() vs contract checks"] },
      { day: 18, topic: "Perf & Cachegrind Profiling", concept: "Profiling", tasks: ["perf stat — hardware counters (IPC, cache misses)", "perf record + perf report — hotspot finding", "valgrind --tool=cachegrind — cache simulation", "Flame graph generation with perf + flamegraph.pl"] },
      { day: 19, topic: "Cache-Friendly Data Structures", concept: "Performance", tasks: ["Cache line = 64 bytes — struct layout", "False sharing: pad to 64B boundary", "Prefetching: __builtin_prefetch()", "SoA vs AoS — cache miss analysis"] },
      { day: 20, topic: "Fixed-Point DSP Library in C", concept: "ECE Bridge", tasks: ["Q15 and Q31 format arithmetic", "Overflow detection & saturation", "Fixed-point FIR filter implementation", "Benchmark: floating point vs fixed-point speed"] },
      { day: 21, topic: "C → CUDA Interoperability", concept: "CUDA Bridge", tasks: ["extern \"C\" linkage for C-callable CUDA", "Compile C and CUDA separately, link together", "Passing arrays between C and CUDA kernels", "Build system: Makefile with nvcc + gcc"] },
      { day: 22, topic: "Signal Handling & Timers", concept: "Systems", tasks: ["sigaction() — robust signal handling", "POSIX timers: timer_create, timer_settime", "Real-time signals (SIGRTMIN)", "Async-signal-safe functions list"] },
      { day: 23, topic: "Embedded C Patterns", concept: "Embedded", tasks: ["Startup code: .bss clear, .data copy, call main()", "Linker script basics: MEMORY + SECTIONS", "Interrupt Service Routine (ISR) in C", "Circular buffer for embedded DSP"] },
      { day: 24, topic: "Static Analysis & Sanitizers", concept: "Quality", tasks: ["clang-tidy — style + bug checks", "AddressSanitizer: -fsanitize=address", "UndefinedBehaviorSanitizer: -fsanitize=undefined", "ThreadSanitizer: -fsanitize=thread"] },
      { day: 25, topic: "Generic Data Structures in C", concept: "DSA Bridge", tasks: ["void* generic containers", "Macro-generated type-safe containers", "Intrusive linked lists (kernel style)", "Generic sort with qsort comparator"] },
      { day: 26, topic: "C Standard Library Deep Dive", concept: "stdlib", tasks: ["stdio.h: setvbuf, fseek, ftell internals", "string.h: memcpy, memmove, memset", "stdlib.h: qsort, bsearch, atexit", "time.h: clock_gettime(CLOCK_MONOTONIC)"] },
      { day: 27, topic: "Build Systems & CMake", concept: "Engineering", tasks: ["CMakeLists.txt — modern CMake targets", "find_package() — locating libraries", "cmake --build with CUDA support", "Compile flags per target: target_compile_options()"] },
      { day: 28, topic: "C Obfuscation & Internals Quiz", concept: "Mastery", tasks: ["Sequence points — undefined behavior traps", "Integer promotion rules", "Pointer provenance — strict aliasing rule", "C99 VLA — use cases and dangers"] },
      { day: 29, topic: "Writing High-Performance C Libraries", concept: "Library Design", tasks: ["API design: opaque types + handle pattern", "Symbol visibility: __attribute__((visibility))", "Versioned symbols with .map files", "Documentation with Doxygen"] },
      { day: 30, topic: "Advanced C Capstone", concept: "Capstone", tasks: ["Implement a fixed-point DSP library", "SIMD-accelerated convolution", "Thread-safe ring buffer", "Full valgrind + sanitizer clean + benchmarked"] },
    ]
  },
  "DSA in C": {
    label: "DSA in C",
    full: "Data Structures & Algorithms in C",
    color: "#C084FC",
    dim: "#C084FC40",
    glow: "0 0 12px #C084FC80",
    icon: "⊕",
    days: [
      { day: 1, topic: "C Pointer Foundations for DSA", concept: "Prereq", tasks: ["Struct self-reference: struct Node { int data; struct Node *next; }", "Malloc for nodes: Node *n = malloc(sizeof(Node))", "Double pointers for head modification", "valgrind from day 1 — no leaks tolerated"] },
      { day: 2, topic: "Singly Linked List — Full Impl", concept: "LinkedList", tasks: ["Insert at head, tail, position", "Delete by value and by position", "Traverse and print", "Length, search, get-Nth-from-end"] },
      { day: 3, topic: "Linked List — Classic Problems", concept: "LinkedList", tasks: ["Reverse (iterative + recursive)", "Detect cycle — Floyd's tortoise & hare", "Find middle — slow/fast pointer", "Merge two sorted linked lists"] },
      { day: 4, topic: "Doubly & Circular Lists", concept: "LinkedList", tasks: ["DLL: insert, delete with prev/next", "Circular LL — detect when to stop traversal", "LRU Cache with DLL + hash map", "XOR linked list — memory-efficient DLL"] },
      { day: 5, topic: "Stack — Array & LL Implementation", concept: "Stack", tasks: ["Array stack with top pointer", "Linked list stack (push = insert head)", "Applications: balanced parentheses, undo", "Monotonic stack — next greater element"] },
      { day: 6, topic: "Queue — All Variants", concept: "Queue", tasks: ["Circular array queue — prevent wasted space", "Linked list queue (enqueue tail, dequeue head)", "Deque (double-ended queue)", "BFS uses queue — draw the connection"] },
      { day: 7, topic: "Binary Trees", concept: "Trees", tasks: ["Node struct + recursive insert", "Inorder, Preorder, Postorder (recursive + iterative)", "Height, count nodes, sum of nodes", "Mirror/flip a tree"] },
      { day: 8, topic: "Binary Search Tree", concept: "BST", tasks: ["BST insert, search, delete (3 cases)", "Inorder = sorted sequence — exploit this", "Predecessor & successor", "BST validity check"] },
      { day: 9, topic: "BST — Hard Problems", concept: "BST", tasks: ["K-th smallest element in BST", "LCA (Lowest Common Ancestor)", "BST to sorted doubly linked list", "Convert sorted array to balanced BST"] },
      { day: 10, topic: "AVL Trees", concept: "Balanced BST", tasks: ["Balance factor = height(left) - height(right)", "LL, RR, LR, RL rotations — draw & code all 4", "AVL insert with rebalancing", "AVL deletion — harder than insert"] },
      { day: 11, topic: "Heaps & Priority Queue", concept: "Heap", tasks: ["Max-heap property: parent ≥ children", "Heapify-up (insert) and heapify-down (extract)", "Heap sort — O(N log N) in-place", "Priority queue with heap — k-largest elements"] },
      { day: 12, topic: "Hash Tables from Scratch", concept: "Hashing", tasks: ["Hash function: djb2, FNV-1a", "Separate chaining with linked lists", "Open addressing: linear probing, quadratic", "Load factor, rehashing, prime table sizes"] },
      { day: 13, topic: "Graphs — Representation", concept: "Graphs", tasks: ["Adjacency matrix: space O(V²)", "Adjacency list: space O(V+E)", "Weighted & directed graph structs in C", "Edge list representation"] },
      { day: 14, topic: "Graph Traversal — DFS & BFS", concept: "Graphs", tasks: ["BFS with queue — level-by-level", "DFS iterative (stack) + recursive", "Connected components count", "Bipartite graph check with BFS coloring"] },
      { day: 15, topic: "Topological Sort", concept: "Graphs", tasks: ["Topological sort — only for DAGs", "Kahn's algorithm: BFS-based (in-degree)", "DFS-based topological sort", "Detecting cycles in directed graph"] },
      { day: 16, topic: "Shortest Path Algorithms", concept: "Graphs", tasks: ["Dijkstra's SSSP — greedy with min-heap", "Bellman-Ford — handles negative edges", "SSSP for unweighted: BFS", "Floyd-Warshall: all-pairs O(V³)"] },
      { day: 17, topic: "Minimum Spanning Tree", concept: "Graphs", tasks: ["Prim's algorithm — greedy, grow MST", "Kruskal's algorithm — sort edges, union-find", "Proof of MST optimality (cut property)", "Applications: network design, clustering"] },
      { day: 18, topic: "Union-Find / DSU", concept: "DSU", tasks: ["Parent array initialization", "find() with path compression", "union() by rank / by size", "Applications: Kruskal's, grid connectivity"] },
      { day: 19, topic: "Sorting Algorithms Mastery", concept: "Sorting", tasks: ["Merge sort — stable, O(N log N)", "Quick sort — pivot selection, partition", "Counting sort — O(N+K) for bounded ints", "Radix sort — digit-by-digit, stable"] },
      { day: 20, topic: "Binary Search Variants", concept: "Search", tasks: ["Standard binary search (iterative)", "First/last occurrence of element", "Search in rotated sorted array", "Find peak element — binary search on answer"] },
      { day: 21, topic: "Divide & Conquer", concept: "D&C", tasks: ["Merge sort as canonical D&C", "Quick select — k-th smallest O(N) avg", "Closest pair of points — O(N log N)", "Karatsuba multiplication"] },
      { day: 22, topic: "Dynamic Programming — Foundations", concept: "DP", tasks: ["Memoization vs tabulation — both in C", "Fibonacci: top-down vs bottom-up", "0/1 Knapsack — 2D DP table", "Coin change — minimum coins"] },
      { day: 23, topic: "DP — Sequence Problems", concept: "DP", tasks: ["Longest Common Subsequence (LCS)", "Longest Increasing Subsequence (LIS) — O(N log N)", "Edit distance (Levenshtein)", "Longest Palindromic Subsequence"] },
      { day: 24, topic: "DP — Advanced", concept: "DP", tasks: ["Matrix Chain Multiplication — interval DP", "DP on trees: diameter, max path sum", "Bitmask DP — TSP", "DP + binary search — patience sorting"] },
      { day: 25, topic: "Tries", concept: "Tries", tasks: ["Trie node: struct {TrieNode *children[26]; bool end;}", "Insert & search strings O(L)", "Prefix search / autocomplete", "Compressed trie / Patricia trie"] },
      { day: 26, topic: "Segment Trees", concept: "Advanced Trees", tasks: ["Build: O(N), Query: O(log N), Update: O(log N)", "Range sum and range min queries", "Lazy propagation for range updates", "Segment tree for signal processing: range max"] },
      { day: 27, topic: "Fenwick Tree (BIT)", concept: "Advanced Trees", tasks: ["BIT update: O(log N), prefix query: O(log N)", "Point update + prefix sum", "2D BIT for 2D prefix sums", "BIT vs Segment tree — when to prefer"] },
      { day: 28, topic: "Greedy Algorithms", concept: "Greedy", tasks: ["Activity selection / interval scheduling", "Huffman coding — optimal prefix-free codes", "Fractional knapsack", "Greedy proof by exchange argument"] },
      { day: 29, topic: "String Algorithms", concept: "Strings", tasks: ["KMP pattern matching — failure function", "Z-algorithm — O(N) string matching", "Rabin-Karp — rolling hash", "Manacher's — longest palindromic substring O(N)"] },
      { day: 30, topic: "DSA in C Capstone", concept: "Capstone", tasks: ["Build a graph-based DSP scheduler", "Topological order of filter stages", "Priority queue for signal priority routing", "Full implementation: documented, valgrind-clean"] },
    ]
  }
};

const TRACK_KEYS = ["DSP", "Adv Python", "CUDA", "Adv C", "DSA in C"];
const STATUS = { pending: 0, review: 1, done: 2 };
const STATUS_LABELS = ["pending", "review", "done"];

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

function OscGrid() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FFB2" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function WaveformBar({ color, progress }) {
  const w = 120;
  const h = 28;
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * w;
    const filled = i / 39 < progress;
    const y = h / 2 + Math.sin(i * 0.5) * (filled ? 8 : 3);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeOpacity="0.3" />
      <polyline
        points={Array.from({ length: 40 }, (_, i) => {
          const x = (i / 39) * w;
          if (i / 39 > progress) return null;
          const y = h / 2 + Math.sin(i * 0.5) * 8;
          return `${x},${y}`;
        }).filter(Boolean).join(" ")}
        fill="none" stroke={color} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </svg>
  );
}

export default function StriverSheet() {
  const initProgress = () => {
    const p = {};
    TRACK_KEYS.forEach(t => { p[t] = {}; TRACKS[t].days.forEach(d => { p[t][d.day] = 0; }); });
    return p;
  };
  const [progress, setProgress] = useLocalStorage("ece_striver_v1", initProgress());
  const [activeTrack, setActiveTrack] = useState("DSP");
  const [expandedDay, setExpandedDay] = useState(null);
  const [filter, setFilter] = useState("all");

  const cycleStatus = (track, day) => {
    setProgress(prev => {
      const cur = (prev[track]?.[day] ?? 0);
      const next = (cur + 1) % 3;
      return { ...prev, [track]: { ...prev[track], [day]: next } };
    });
  };

  const getTrackStats = (t) => {
    const days = TRACKS[t].days;
    const done = days.filter(d => (progress[t]?.[d.day] ?? 0) === 2).length;
    const review = days.filter(d => (progress[t]?.[d.day] ?? 0) === 1).length;
    return { done, review, total: days.length, pct: Math.round(done / days.length * 100) };
  };

  const totalDone = TRACK_KEYS.reduce((s, t) => s + getTrackStats(t).done, 0);
  const totalAll = TRACK_KEYS.reduce((s, t) => s + getTrackStats(t).total, 0);

  const track = TRACKS[activeTrack];
  const stats = getTrackStats(activeTrack);

  const filteredDays = track.days.filter(d => {
    if (filter === "all") return true;
    const s = progress[activeTrack]?.[d.day] ?? 0;
    if (filter === "pending") return s === 0;
    if (filter === "review") return s === 1;
    if (filter === "done") return s === 2;
    return true;
  });

  const statusIcon = (s) => s === 2 ? "✓" : s === 1 ? "◐" : "○";
  const statusColor = (s, trackColor) => s === 2 ? trackColor : s === 1 ? "#FFD93D" : "rgba(255,255,255,0.2)";

  return (
    <div style={{ minHeight: "100vh", background: "#080C10", color: "#E8EDF2", fontFamily: "'IBM Plex Mono', monospace", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <OscGrid />

      {/* ── Header ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>
              ECE · SYSTEMS · GPU · DSP
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", letterSpacing: "4px", margin: 0, lineHeight: 1, color: "#fff" }}>
              STRIVER SHEET
            </h1>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "6px", letterSpacing: "2px" }}>
              5 TRACKS · 150 DAYS · TOTAL MASTERY
            </div>
          </div>

          {/* Global meter */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", lineHeight: 1, color: "#fff", letterSpacing: "2px" }}>
              {totalDone}<span style={{ fontSize: "22px", color: "rgba(255,255,255,0.25)" }}>/{totalAll}</span>
            </div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>DAYS COMPLETED</div>
            <div style={{ width: "200px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden", marginLeft: "auto" }}>
              <div style={{ height: "100%", width: `${(totalDone / totalAll) * 100}%`, background: "linear-gradient(90deg, #00FFB2, #76C7F5, #C084FC)", transition: "width 0.6s ease" }} />
            </div>
          </div>
        </div>

        {/* Track tabs */}
        <div style={{ display: "flex", gap: "2px", overflowX: "auto", paddingBottom: "0" }}>
          {TRACK_KEYS.map(t => {
            const tr = TRACKS[t];
            const st = getTrackStats(t);
            const isActive = activeTrack === t;
            return (
              <button key={t} onClick={() => { setActiveTrack(t); setExpandedDay(null); setFilter("all"); }}
                style={{
                  padding: "10px 20px 12px",
                  background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${tr.color}` : "2px solid transparent",
                  color: isActive ? tr.color : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  minWidth: "120px"
                }}>
                <span style={{ fontSize: "18px" }}>{tr.icon}</span>
                <span>{tr.label}</span>
                <WaveformBar color={tr.color} progress={st.pct / 100} />
                <span style={{ fontSize: "9px", color: isActive ? tr.color : "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>
                  {st.done}/{st.total} · {st.pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Track Content ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "24px 32px", maxWidth: "1200px" }}>

        {/* Track header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "3px", color: track.color, textShadow: track.glow }}>
              {track.full}
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.2)", paddingTop: "4px" }}>
              {stats.done} DONE · {stats.review} REVIEW · {30 - stats.done - stats.review} PENDING
            </span>
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: "4px" }}>
            {["all", "pending", "review", "done"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: "5px 12px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  border: `1px solid ${filter === f ? track.color : "rgba(255,255,255,0.1)"}`,
                  background: filter === f ? track.dim : "transparent",
                  color: filter === f ? track.color : "rgba(255,255,255,0.3)",
                  borderRadius: "3px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "uppercase"
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "20px", position: "relative" }}>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "1px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${stats.pct}%`, background: track.color, transition: "width 0.5s ease", boxShadow: track.glow }} />
          </div>
        </div>

        {/* Days grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {filteredDays.map((day) => {
            const s = progress[activeTrack]?.[day.day] ?? 0;
            const isExpanded = expandedDay === day.day;
            return (
              <div key={day.day}
                style={{
                  border: `1px solid ${isExpanded ? track.color + "50" : "rgba(255,255,255,0.06)"}`,
                  borderLeft: `3px solid ${isExpanded ? track.color : statusColor(s, track.color)}`,
                  borderRadius: "4px",
                  background: isExpanded ? "rgba(255,255,255,0.04)" : s === 2 ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.01)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  overflow: "hidden"
                }}>

                {/* Row */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: "12px" }}
                  onClick={() => setExpandedDay(isExpanded ? null : day.day)}>

                  {/* Day number */}
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "1px", color: track.color, opacity: 0.6, minWidth: "36px" }}>
                    {day.day.toString().padStart(2, "0")}
                  </span>

                  {/* Topic */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: s === 2 ? 400 : 500, color: s === 2 ? "rgba(255,255,255,0.4)" : "#E8EDF2", textDecoration: s === 2 ? "line-through" : "none" }}>
                        {day.topic}
                      </span>
                      <span style={{ fontSize: "9px", padding: "2px 8px", border: `1px solid ${track.color}40`, color: track.color, borderRadius: "2px", letterSpacing: "1px", opacity: 0.8, whiteSpace: "nowrap" }}>
                        {day.concept}
                      </span>
                    </div>
                  </div>

                  {/* Expand hint */}
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", marginRight: "8px" }}>
                    {isExpanded ? "▲ CLOSE" : "▼ TASKS"}
                  </span>

                  {/* Status cycle button */}
                  <button onClick={(e) => { e.stopPropagation(); cycleStatus(activeTrack, day.day); }}
                    title={`Status: ${STATUS_LABELS[s]} → click to cycle`}
                    style={{
                      width: "32px", height: "32px",
                      borderRadius: "50%",
                      border: `1.5px solid ${statusColor(s, track.color)}`,
                      background: s === 2 ? track.dim : "transparent",
                      color: statusColor(s, track.color),
                      fontSize: s === 2 ? "14px" : "16px",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                      boxShadow: s === 2 ? track.glow : "none"
                    }}>
                    {statusIcon(s)}
                  </button>
                </div>

                {/* Expanded tasks */}
                {isExpanded && (
                  <div style={{ padding: "0 14px 14px 62px", borderTop: `1px solid ${track.color}20` }}>
                    <div style={{ paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                      {day.tasks.map((task, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: "1.6" }}>
                          <span style={{ color: track.color, fontSize: "9px", marginTop: "4px", flexShrink: 0 }}>▸</span>
                          {task}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: `1px solid rgba(255,255,255,0.05)`, display: "flex", gap: "8px" }}>
                      {STATUS_LABELS.map((sl, si) => (
                        <button key={sl} onClick={(e) => { e.stopPropagation(); setProgress(prev => ({ ...prev, [activeTrack]: { ...prev[activeTrack], [day.day]: si } })); }}
                          style={{
                            padding: "4px 12px", fontSize: "9px", letterSpacing: "1px", fontFamily: "'IBM Plex Mono', monospace",
                            border: `1px solid ${(progress[activeTrack]?.[day.day] ?? 0) === si ? track.color : "rgba(255,255,255,0.1)"}`,
                            background: (progress[activeTrack]?.[day.day] ?? 0) === si ? track.dim : "transparent",
                            color: (progress[activeTrack]?.[day.day] ?? 0) === si ? track.color : "rgba(255,255,255,0.3)",
                            borderRadius: "2px", cursor: "pointer", textTransform: "uppercase"
                          }}>
                          {sl === "pending" ? "○ pending" : sl === "review" ? "◐ review" : "✓ done"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredDays.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.15)", fontSize: "12px", letterSpacing: "3px" }}>
            NO DAYS IN THIS FILTER
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "rgba(255,255,255,0.15)", letterSpacing: "2px" }}>
          <span>CLICK ROW → EXPAND TASKS &nbsp;·&nbsp; CLICK ○ → CYCLE STATUS</span>
          <span>PROGRESS AUTO-SAVED TO BROWSER</span>
        </div>
      </div>
    </div>
  );
}
