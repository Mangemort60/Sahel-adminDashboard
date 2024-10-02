// Exemple de fonction utilitaire pour formater un nom de fichier
export const formatFileName = (originalName: string): string => {
  const timestamp = new Date().toISOString();
  const cleanName = originalName.replace(/\s+/g, '-').toLowerCase();
  return `${timestamp}-${cleanName}`;
};
