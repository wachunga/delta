var Delta = require('../dist/Delta');
var Iterator = require('../dist/Delta').Iterator;

describe('Iterator', function() {
  beforeEach(function() {
    this.delta = new Delta()
      .insert('Hello', { bold: true })
      .retain(3)
      .insert(2, { src: 'http://quilljs.com/' })
      .delete(4);
  });

  it('hasNext() true', function() {
    var iter = new Iterator(this.delta.ops);
    expect(iter.hasNext()).toEqual(true);
  });

  it('hasNext() false', function() {
    var iter = new Iterator([]);
    expect(iter.hasNext()).toEqual(false);
  });

  it('peekLength() offset === 0', function() {
    var iter = new Iterator(this.delta.ops);
    expect(iter.peekLength()).toEqual(5);
    iter.next();
    expect(iter.peekLength()).toEqual(3);
    iter.next();
    expect(iter.peekLength()).toEqual(1);
    iter.next();
    expect(iter.peekLength()).toEqual(4);
  });

  it('peekLength() offset > 0', function() {
    var iter = new Iterator(this.delta.ops);
    iter.next(2);
    expect(iter.peekLength()).toEqual(5 - 2);
  });

  it('peekLength() no ops left', function() {
    var iter = new Iterator([]);
    expect(iter.peekLength()).toEqual(Infinity);
  });

  it('peekType()', function() {
    var iter = new Iterator(this.delta.ops);
    expect(iter.peekType()).toEqual('insert');
    iter.next();
    expect(iter.peekType()).toEqual('retain');
    iter.next();
    expect(iter.peekType()).toEqual('insert');
    iter.next();
    expect(iter.peekType()).toEqual('delete');
    iter.next();
    expect(iter.peekType()).toEqual('retain');
  });

  it('next()', function() {
    var iter = new Iterator(this.delta.ops);
    for (var i = 0; i < this.delta.ops.length; i += 1) {
      expect(iter.next()).toEqual(this.delta.ops[i]);
    }
    expect(iter.next()).toEqual({ retain: Infinity });
    expect(iter.next(4)).toEqual({ retain: Infinity });
    expect(iter.next()).toEqual({ retain: Infinity });
  });

  it('next(length)', function() {
    var iter = new Iterator(this.delta.ops);
    expect(iter.next(2)).toEqual({
      insert: 'He',
      attributes: { bold: true },
    });
    expect(iter.next(10)).toEqual({
      insert: 'llo',
      attributes: { bold: true },
    });
    expect(iter.next(1)).toEqual({ retain: 1 });
    expect(iter.next(2)).toEqual({ retain: 2 });
  });

  it('rest()', function() {
    var iter = new Iterator(this.delta.ops);
    iter.next(2);
    expect(iter.rest()).toEqual([
      { insert: 'llo', attributes: { bold: true } },
      { retain: 3 },
      { insert: 2, attributes: { src: 'http://quilljs.com/' } },
      { delete: 4 },
    ]);
    iter.next(3);
    expect(iter.rest()).toEqual([
      { retain: 3 },
      { insert: 2, attributes: { src: 'http://quilljs.com/' } },
      { delete: 4 },
    ]);
    iter.next(3);
    iter.next(2);
    iter.next(4);
    expect(iter.rest()).toEqual([]);
  });
});
