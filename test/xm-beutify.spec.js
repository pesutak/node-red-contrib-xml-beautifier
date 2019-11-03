var should = require('should');
var helper = require('node-red-node-test-helper');
var xmlbeautify = require('../src/nodes/xml-beautify');

helper.init(require.resolve('node-red'));

const inputMsg = '<root><test><number>42</number><string>"hello"</string></test></root>';
const resultMsg = 
`<root>
    <test>
        <number>42</number>
        <string>"hello"</string>
    </test>
</root>`;

describe('xml-beautify node',  () => {
  
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    should();
    helper.stopServer(done);
  });

  it('should be loaded', (done) => {
    var flow = [{ id: 'n1', type: 'xml-beautify', name: 'test name' }];
    helper.load(xmlbeautify, flow, () => {
      var n1 = helper.getNode('n1');
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  describe('integration',() => {
    it('should make payload beautify',  (done) => {

        var flow = [
          { id: "n1", type: "xml-beautify", name: "xmlb", spaces: 4, wires:[["n2"]] },
          { id: "n2", type: "helper" }
        ];
        helper.load(xmlbeautify, flow,  () => {
          var n2 = helper.getNode("n2");
          var n1 = helper.getNode("n1");
          n1.should.have.property('spaces', 4);
          n2.on("input", (msg) => {
            //resultMsg.should.be.equal(msg.payload);
            msg.should.have.property('payload', resultMsg);
            done();
          });
          n1.receive({ payload: inputMsg });
        });
      });
  });
});
