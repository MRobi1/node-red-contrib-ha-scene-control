module.exports = function (RED) {
  function SceneControl(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const { zwave, nodeid, switchtype, outputs } = config;
    this.zwave = zwave;
    this.nodeid = nodeid;
    this.switchtype = switchtype;
    this.outputs = parseInt(outputs, 10);

    node.on("input", (msg) => {
      const { zwave: presetZwave, nodeid, switchtype, outputs } = node;
      const { payload } = msg;
      const domain = payload.event.domain;
      const event_type = payload.event_type;
      const nodes = nodeid.split(',').map(Number);
      const node_id = parseInt(payload.event.node_id);
      const event_types = {
        zwave_js: "zwave_js_value_notification",
        ozw: "ozw.scene_activated",
        zwave: "zwave.scene_activated",
      };

      var error = 0;
      function validateDomain(preset, incoming) {
        if (preset !== incoming) {
          node.error(
            `Incorrect Z-Wave Integration. Node is set for ${preset} but recieved an event for ${incoming}`
          );
          error++;
        } else {
          validateEventType();
        }
      }
      function validateEventType() {
        if (event_types[domain] !== event_type) {
          let correctType = event_types[domain];
          node.error(
            `Incorrect Event Type Recieved. Node is set for ${domain} which expects an event type of ${correctType}`
          );
          error++;
        }
      }
      validateDomain(presetZwave, domain);

      if (nodes.includes(node_id) === true && error === 0) {
        const LZW30Map = {
          0: {
            button: 2,
            scene: 1,
          },
          1: {
            button: 2,
            scene: 4,
          },
          2: {
            button: 2,
            scene: 5,
          },
          3: {
            button: 2,
            scene: 6,
          },
          4: {
            button: 2,
            scene: 7,
          },
          5: {
            button: 2,
            scene: 2,
          },
          6: {
            button: 2,
            scene: 3,
          },
          7: {
            button: 1,
            scene: 1,
          },
          8: {
            button: 1,
            scene: 4,
          },
          9: {
            button: 1,
            scene: 5,
          },
          10: {
            button: 1,
            scene: 6,
          },
          11: {
            button: 1,
            scene: 7,
          },
          12: {
            button: 1,
            scene: 2,
          },
          13: {
            button: 1,
            scene: 3,
          },
          14: {
            button: 3,
            scene: 1,
          },
        };
        const LZW31Map = {
          0: {
            button: 2,
            scene: 1,
          },
          1: {
            button: 2,
            scene: 4,
          },
          2: {
            button: 2,
            scene: 5,
          },
          3: {
            button: 2,
            scene: 6,
          },
          4: {
            button: 2,
            scene: 7,
          },
          5: {
            button: 2,
            scene: 2,
          },
          6: {
            button: 2,
            scene: 3,
          },
          7: {
            button: 1,
            scene: 1,
          },
          8: {
            button: 1,
            scene: 4,
          },
          9: {
            button: 1,
            scene: 5,
          },
          10: {
            button: 1,
            scene: 6,
          },
          11: {
            button: 1,
            scene: 7,
          },
          12: {
            button: 1,
            scene: 2,
          },
          13: {
            button: 1,
            scene: 3,
          },
          14: {
            button: 3,
            scene: 1,
          },
        };
        const LZW36Map = {
          0: {
            button: 2,
            scene: 0,
          },
          1: {
            button: 2,
            scene: 3,
          },
          2: {
            button: 2,
            scene: 4,
          },
          3: {
            button: 2,
            scene: 5,
          },
          4: {
            button: 2,
            scene: 6,
          },
          5: {
            button: 2,
            scene: 2,
          },
          6: {
            button: 2,
            scene: 1,
          },
          7: {
            button: 3,
            scene: 0,
          },
          8: {
            button: 4,
            scene: 0,
          },
          9: {
            button: 1,
            scene: 0,
          },
          10: {
            button: 1,
            scene: 3,
          },
          11: {
            button: 1,
            scene: 4,
          },
          12: {
            button: 1,
            scene: 5,
          },
          13: {
            button: 1,
            scene: 6,
          },
          14: {
            button: 1,
            scene: 2,
          },
          15: {
            button: 1,
            scene: 1,
          },
          16: {
            button: 5,
            scene: 0,
          },
          17: {
            button: 6,
            scene: 0,
          },
        };
        const LZW45Map = {
          0: {
            button: 2,
            scene: 1,
          },
          1: {
            button: 2,
            scene: 4,
          },
          2: {
            button: 2,
            scene: 5,
          },
          3: {
            button: 2,
            scene: 6,
          },
          4: {
            button: 2,
            scene: 7,
          },
          5: {
            button: 2,
            scene: 2,
          },
          6: {
            button: 2,
            scene: 3,
          },
          7: {
            button: 1,
            scene: 1,
          },
          8: {
            button: 1,
            scene: 4,
          },
          9: {
            button: 1,
            scene: 5,
          },
          10: {
            button: 1,
            scene: 6,
          },
          11: {
            button: 1,
            scene: 7,
          },
          12: {
            button: 1,
            scene: 2,
          },
          13: {
            button: 1,
            scene: 3,
          },
          14: {
            button: 3,
            scene: 1,
          },
        };
        var button, scene;
        var output = new Array(outputs);
        switch (domain) {
          case "zwave_js":
            button = parseInt(payload.event.property_key);
            scene = parseInt(payload.event.value_raw);
            break;
          case "ozw":
            button = parseInt(payload.event.scene_id);
            scene = parseInt(payload.event.scene_value_id);
            break;
          case "zwave":
            button = parseInt(payload.event.scene_id);
            var sceneConvert = {
              7620: 0,
              7680: 1,
              7740: 2,
              7800: 3,
              7860: 4,
              7920: 5,
              7980: 6,
              8040: 7,
            };
            scene = sceneConvert[payload.event.scene_data];
            break;
        }
        switch (switchtype) {
          case "LZW30":
            for (var i = 0; i < outputs; i++) {
              if (
                button === LZW30Map[i].button &&
                scene === LZW30Map[i].scene
              ) {
                output[i] = msg;
              }
            }
            break;
          case "LZW31":
            for (var i = 0; i < outputs; i++) {
              if (
                button === LZW31Map[i].button &&
                scene === LZW31Map[i].scene
              ) {
                output[i] = msg;
              }
            }
            break;
          case "LZW36":
            for (var i = 0; i < outputs; i++) {
              if (
                button === LZW36Map[i].button &&
                scene === LZW36Map[i].scene
              ) {
                output[i] = msg;
              }
            }
            break;
          case "LZW45":
            for (var i = 0; i < outputs; i++) {
              if (
                button === LZW45Map[i].button &&
                scene === LZW45Map[i].scene
              ) {
                output[i] = msg;
              }
            }
            break;
        }
        node.send(output);
      }
    });
  }
  RED.nodes.registerType("scene-controlr", SceneControl);
};
