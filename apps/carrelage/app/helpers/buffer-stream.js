import stream from 'stream';

export default class BufferStream extends stream.Readable {
    constructor(buffer, options) {
        super(options || {});
        this.buffer = buffer;
    }
    _read(size) {
        if (this.buffer.length === 0) {
            this.push(null);
        } else {
            this.push(this.buffer.slice(0, size));
            this.buffer = this.buffer.slice(size);
        }
    }
}
