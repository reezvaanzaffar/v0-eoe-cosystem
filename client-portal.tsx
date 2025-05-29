import { TestingIntegration } from "@/components/testing/testing-integration"

export default function ClientPortal() {
  return (
    <TestingIntegration>
      <div className="min-h-screen bg-gray-50">{/* existing portal content */}</div>
    </TestingIntegration>
  )
}
