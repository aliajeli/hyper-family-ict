"use client";

import { Badge, Button, Modal } from "@/components/ui";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const SummaryModal = ({ isOpen, onClose, results }) => {
  // results structure: [{ target: 'IP', file: 'name', status: 'success'|'error', message: '...' }]

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Operation Summary"
      size="lg"
    >
      <div className="flex flex-col h-[500px]">
        {/* Header Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-success/10 border border-success/20 rounded p-3 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <div className="text-xl font-bold text-success">
                {successCount}
              </div>
              <div className="text-xs text-text-muted">Successful</div>
            </div>
          </div>
          <div className="flex-1 bg-error/10 border border-error/20 rounded p-3 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-error" />
            <div>
              <div className="text-xl font-bold text-error">{errorCount}</div>
              <div className="text-xs text-text-muted">Failed</div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="flex-1 overflow-y-auto bg-bg-tertiary rounded border border-border">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-secondary text-text-secondary sticky top-0">
              <tr>
                <th className="px-3 py-2">System IP</th>
                <th className="px-3 py-2">File / Action</th>
                <th className="px-3 py-2">Result</th>
                <th className="px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((res, idx) => (
                <tr key={idx} className="hover:bg-bg-hover">
                  <td className="px-3 py-2 font-mono">{res.target}</td>
                  <td className="px-3 py-2">{res.file}</td>
                  <td className="px-3 py-2">
                    {res.status === "success" && (
                      <Badge variant="success">Success</Badge>
                    )}
                    {res.status === "error" && (
                      <Badge variant="error">Failed</Badge>
                    )}
                    {res.status === "skipped" && (
                      <Badge variant="warning">Skipped</Badge>
                    )}
                  </td>
                  <td
                    className="px-3 py-2 text-text-muted truncate max-w-[200px]"
                    title={res.message}
                  >
                    {res.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close Report</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SummaryModal;
