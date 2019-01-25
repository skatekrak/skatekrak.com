export default class Thread {
    public static async sleep(ms: number): Promise<{}> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }
}
