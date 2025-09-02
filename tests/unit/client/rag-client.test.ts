import {
  createTestContext,
  mockRAGDocument,
  type TestContext,
} from "../../setup/test-utils";

const mockFile = Buffer.from("test document content");

describe("RAGClient", () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext();
  });

  afterEach(() => {
    context.mock.reset();
  });

  describe("uploadDocument", () => {
    it("should upload document successfully", async () => {
      const uploadResponse = {
        document_id: "doc-123",
        message: "Document uploaded successfully",
        extraction_status: "processing",
      };

      context.mock.onPost("/rag/documents/upload").reply(200, uploadResponse);

      const result = await context.client.rag.uploadDocument(
        mockFile,
        "test-document.pdf",
        "A test document",
      );

      expect(result).toEqual(uploadResponse);
    });

    it("should handle upload failure", async () => {
      context.mock
        .onPost("/rag/documents/upload")
        .reply(400, { message: "Unsupported file type" });

      await expect(
        context.client.rag.uploadDocument(mockFile, "test.exe", "Test file"),
      ).rejects.toThrow();
    });
  });

  describe("getDocuments", () => {
    it("should get documents successfully", async () => {
      const documents = {
        documents: [mockRAGDocument, { ...mockRAGDocument, id: "doc-124" }],
        total: 2,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/rag/documents").reply(200, documents);

      const result = await context.client.rag.getDocuments(0, 10);
      expect(result).toEqual(documents);
    });
  });

  describe("getDocument", () => {
    it("should get document details successfully", async () => {
      context.mock.onGet("/rag/documents/doc-123").reply(200, mockRAGDocument);

      const document = await context.client.rag.getDocument("doc-123");
      expect(document).toEqual(mockRAGDocument);
    });

    it("should handle document not found", async () => {
      context.mock
        .onGet("/rag/documents/doc-999")
        .reply(404, { message: "Document not found" });

      await expect(context.client.rag.getDocument("doc-999")).rejects.toThrow();
    });
  });

  describe("updateDocument", () => {
    it("should update document successfully", async () => {
      const updatedDocument = { ...mockRAGDocument, name: "Updated Document" };
      context.mock.onPut("/rag/documents/doc-123").reply(200, updatedDocument);

      const result = await context.client.rag.updateDocument("doc-123", {
        name: "Updated Document",
      });

      expect(result).toEqual(updatedDocument);
    });
  });

  describe("deleteDocument", () => {
    it("should delete document successfully", async () => {
      context.mock.onDelete("/rag/documents/doc-123").reply(200, {});

      await expect(
        context.client.rag.deleteDocument("doc-123"),
      ).resolves.not.toThrow();
    });
  });

  describe("getDocumentAgents", () => {
    it("should get document agents successfully", async () => {
      const agents = {
        agents: [
          {
            rag_prompt: "Use this document for reference",
            is_active: true,
            priority: 1,
            id: "link-123",
            agent_id: "agent-123",
            document_id: "doc-123",
            created_at: "2023-06-15T10:30:00Z",
            updated_at: null,
            agent_name: "Test Agent",
            agent_description: "A test agent",
            agent_is_public: false,
            agent_status: "active",
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pages: 1,
      };

      context.mock.onGet("/rag/documents/doc-123/agents").reply(200, agents);

      const result = await context.client.rag.getDocumentAgents("doc-123");
      expect(result).toEqual(agents);
    });
  });

  describe("queryUserDocuments", () => {
    it("should query user documents successfully", async () => {
      const queryResult = {
        query_id: "query-123",
        response_text: "The capital of France is Paris.",
        source_documents: ["doc-123", "doc-124"],
        confidence_score: "0.85",
        processing_time_ms: 500,
        tokens_used: 150,
      };

      context.mock.onPost("/rag/query").reply(200, queryResult);

      const result = await context.client.rag.queryUserDocuments({
        query_text: "What is the capital of France?",
      });

      expect(result).toEqual(queryResult);
    });
  });

  describe("getRAGStats", () => {
    it("should get RAG statistics successfully", async () => {
      const stats = {
        total_documents: 10,
        active_documents: 8,
        total_queries: 50,
        successful_queries: 45,
        failed_queries: 5,
        avg_processing_time_ms: 500,
        total_tokens_used: 5000,
      };

      context.mock.onGet("/rag/stats").reply(200, stats);

      const result = await context.client.rag.getRAGStats();
      expect(result).toEqual(stats);
    });
  });
});
