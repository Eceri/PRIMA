namespace L01_Playarea {
    import f = FudgeCore;
  function createNode(
    _name: string,
    _mesh: f.Mesh,
    _material: f.Material,
    _translation: f.Vector3,
    _scaling: f.Vector3
  ): f.Node {
    let node: f.Node = new f.Node(_name);
    node.addComponent(new f.ComponentTransform());
    node.addComponent(new f.ComponentMaterial(_material));
    node.addComponent(new f.ComponentMesh(_mesh));
    node.cmpTransform.local.translate(_translation);
    node.cmpTransform.local.scale(_scaling);
    return node;
  }
}
