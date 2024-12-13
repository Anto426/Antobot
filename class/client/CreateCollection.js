class CreateCollection {
    constructor() {
        this.collection = new Collection();
    }

    async createCollection(root, extension) {
        try {
            const files = this.getFilesRecursively(root, extension);
            await Promise.all(files.map(file => this.loadFile(file)));
            return this.collection;
        } catch (error) {
            throw ERROR_CODE.COLLECTION_CREATION_FAILED;
        }
    }

    getFilesRecursively(dir, extension) {
        try {
            const files = [];
            const items = fs.readdirSync(dir, { withFileTypes: true });

            for (const item of items) {
                const path = `${dir}/${item.name}`;
                if (item.isDirectory()) {
                    files.push(...this.getFilesRecursively(path, extension));
                } else if (item.name.endsWith(extension)) {
                    files.push(path);
                }
            }
            return files;
        } catch (error) {
            throw ERROR_CODE.FILE_READ_ERROR;
        }
    }

    async loadFile(filePath) {
        try {
            const file = await import(filePath);
            if (file?.name) {
                this.collection.set(file.name, file);
            }
        } catch (error) {
            throw ERROR_CODE.FILE_IMPORT_ERROR;
        }
    }
}