const Scene = new THREE.Scene();
const camera = new THREE.Camera();
Scene.add(camera)
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement );
var ArToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
});
ArToolkitSource.init(function(){
    setTimeout(function(){
        ArToolkitSource.onResizeElement();
        ArToolkitSource.copyElementSizeTo(renderer.domElement);
    },2000)
});
var ArToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl:'camera_para.dat',
    detectionMode: 'color_and_matrix',
});
ArToolkitContext.init(function(){
    camera.projectionMatrix.copy(ArToolkitContext.getProjetionMatrix());
});
var ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext,camera,
{
    type:'pattern',
    patternUrl: 'pattern-iso.patt',
    changeMatrixMode:'cameraTransformMatrix',
});
Scene.visible = false;
const geometry = new THREE.CubeGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial( {
    transparent: true,
    opacity:0.5,
    side: THREE.DoubleSide
} );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = geometry.parameters.height /2;
Scene.add( cube );
function animate() {
	requestAnimationFrame( animate );
    ArToolkitContext.update(ArToolkitSource.domElement);
    Scene.visible = camera.visible;
	renderer.render( Scene, camera );
}
animate();