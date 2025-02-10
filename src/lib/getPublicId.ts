export async function getPublicId(filename: string): Promise<string> {
    const names = filename.split('/')
    return names[names.length - 1].split('.')[0];
}