// Frozen Turkish legal retrieval benchmark: MESA 0.9.0 and 0.9.2.
// Every value is copied verbatim from the owner's frozen benchmark reports. Values are kept
// as strings so nothing is rounded or recomputed; only the decimal separator changes for Turkish.
// TODO(owner): link the benchmark data and reports here once they are public. Until then the page
// must not link to them or describe them as public.

export const benchmark = {
  runDate: { en: '7 November 2026', tr: '7 Kasım 2026' },
  heldOutQuestions: '145',
  answerableTestQuestions: '121',

  // Hero key line and stat tiles.
  headline: {
    hit5v092: '74.4', mrr092: '0.656', hit5v090: '51.2', mrr090: '0.431',
    hit1v092: '57.9', citationHit5: '100'
  },

  // Main results, test split, 121 answerable questions. Search p50 in seconds.
  results: [
    { version: '0.9.0', config: 'noModelsKeyword', mrr: '0.293', hit1: '0.223', hit5: '0.331', hit10: '0.388', doc1: '0.364', doc5: '0.603', p50: '0.96', note: '¹' },
    { version: '0.9.0', config: 'embeddingsDefault', mrr: '0.431', hit1: '0.347', hit5: '0.512', hit10: '0.603', doc1: '0.587', doc5: '0.703', p50: '1.91' },
    { version: '0.9.0', config: 'embeddingsTuned', mrr: '0.500', hit1: '0.397', hit5: '0.620', hit10: '0.703', doc1: '0.603', doc5: '0.752', p50: '1.87' },
    { version: '0.9.0', config: 'offlineJina', mrr: '0.654', hit1: '0.570', hit5: '0.760', hit10: '0.802', doc1: '0.694', doc5: '0.826', p50: '2.47', note: '²', offline: true },
    { version: '0.9.2', config: 'noModels', mrr: '0.300', hit1: '0.223', hit5: '0.397', hit10: '0.463', doc1: '0.446', doc5: '0.579', p50: '0.45' },
    { version: '0.9.2', config: 'embeddings', mrr: '0.514', hit1: '0.380', hit5: '0.678', hit10: '0.769', doc1: '0.562', doc5: '0.769', p50: '1.35' },
    { version: '0.9.2', config: 'embeddingsReranker', mrr: '0.656', hit1: '0.579', hit5: '0.744', hit10: '0.810', doc1: '0.694', doc5: '0.793', p50: '1.98' }
  ],

  // Hit@5 for the three product levels (percent). null = not available in that version.
  chart: [
    { level: 'noModels', v090: '33.1', v092: '39.7' },
    { level: 'embeddings', v090: '51.2', v092: '67.8' },
    { level: 'reranker', v090: null, v092: '74.4' }
  ],

  // Hit@5 by question type, test split. Column order matches byTypeColumns.
  byTypeColumns: ['v090NoModels', 'v090Tuned', 'v090Offline', 'v092NoModels', 'v092Embeddings', 'v092Reranker'],
  byType: [
    { type: 'exact', count: '36', values: ['0.667', '0.889', '0.944', '0.750', '0.861', '0.972'] },
    { type: 'paraphrase', count: '39', values: ['0.103', '0.564', '0.718', '0.154', '0.692', '0.718'] },
    { type: 'crossDocument', count: '17', values: ['0.118', '0.471', '0.706', '0.353', '0.588', '0.765'] },
    { type: 'numberDateDocket', count: '29', values: ['0.345', '0.448', '0.621', '0.310', '0.483', '0.483'] }
  ],

  // Citation questions (new in 0.9.2), Hit@5 in percent.
  citations: { named: '100', naturalWording: '95–100', example: 'TBK m. 315' },

  // Ingest: time until all 141 documents are fully searchable, Colab A100.
  ingest: [
    { version: '0.9.0', setup: 'withEmbeddings', minutes: '29.7', chunks: '3480', perChunk: '0.51' },
    { version: '0.9.2', setup: 'withEmbeddings', minutes: '20.7', chunks: '5041', perChunk: '0.25' },
    { version: '0.9.2', setup: 'withoutModels', minutes: '15.8', chunks: '5041', perChunk: '0.19' }
  ],

  // Weakest question type in 0.9.2 versus the 0.9.0 offline experiment (Hit@5, percent).
  limitationNumbers: { v092: '48.3', offline090: '62.1' },

  setup: {
    corpusDocuments: '141', legalAreas: '8', areaShare: '8–20', decisionYears: '2021–2025', qualityGatePoints: '5',
    questions: '246', dev: '101', test: '145', answerable: '121', noAnswer: '24',
    generator: 'qwen2.5:32b', judge: 'gemma3:27b',
    versions: ['0.9.0', '0.9.2'], embedding: 'BAAI/bge-m3', reranker: 'BAAI/bge-reranker-v2-m3'
  }
};
