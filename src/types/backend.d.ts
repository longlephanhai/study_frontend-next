export { };

declare global {

  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    },
    result: T[]
  }

  interface IUser {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    avatar?: string;
    role: {
      _id: string;
      name: string;
      description?: string;
      permissions?: string[];
    } | string;
    age: number;
    address: string;
    phone: number;
  }

  interface IRole {
    _id: string,
    name: string,
    description?: string,
    permissions?: string[],
    createdBy: {
      _id: string,
      email: string
    },
  }

  interface IWriting {
    _id: string;
    topic: string;
    title: string;
    description: string;
    minWords: number;
    maxWords: number;
    level: string;
    suggestion?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface WritingFeedback {
    overallFeedback: string;
    grammarErrors: {
      original: string;
      correction: string;
      explanation: string;
    }[];
    vocabularySuggestions: {
      word: string;
      suggestion: string;
      reason: string;
    }[];
    structureFeedback: string;
    score: {
      grammar: number;
      vocabulary: number;
      coherence: number;
      taskResponse: number;
      overall: number;
    };
    improvedVersion?: string;
  }

  interface IWritingHistory {
    _id: string;
    userId: string;
    writingId: {
      _id: string;
      topic: string;
      title: string;
    };
    content: string;
    feedback: WritingFeedback;
  }

  interface ITest {
    _id: string;
    title: string;
    description: string;
    durationSec: number;
    isPublic: boolean;
    totalQuestions: number;
    parts: IPart[];
    audioUrl: string;
  }
}

