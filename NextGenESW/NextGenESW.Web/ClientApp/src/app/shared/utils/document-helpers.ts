export function filterDocumentsByContentCodes(documents: any[] = [], contentTypes: string[] = []) {
  return documents.filter(item => contentTypes.includes(item.assettypecode));
}