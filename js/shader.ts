// cube vertex shader
var cubeVertexShaderStr =
`#version 300 es
uniform mat4 modelViewProjectionMatrix;in vec3 vertex_position;in vec3 vertex_color;out vec4 v_color;
void main(void){gl_Position=modelViewProjectionMatrix*vec4(vertex_position,1.0);
v_color=vec4(vertex_color,1.0);}`;


// cube fragment shader 0 (color shader)
var cubeFragmentShaderStr =
`#version 300 es
precision mediump float;in vec4 v_color;out vec4 fragColor;
void main(void){fragColor=v_color;}`;


// quad vertex shader
var quadVertexShaderStr =
`#version 300 es
uniform mat4 modelViewProjectionMatrix;in vec3 vertex_position;in vec2 vertex_textureCoord;out vec2 texture_coord;
void main(void){gl_Position=vec4(vertex_position,1.0);texture_coord=vertex_textureCoord;}`;


// quad fragment shader
var quadFragmentShaderStr =
`#version 300 es
precision mediump float;precision mediump sampler2D;uniform sampler2D final_image;in vec2 texture_coord;out vec4 fragColor;
void main(void){fragColor=texture(final_image,texture_coord);}`;


// raycasting vertex shader
var rayCastingVertexShaderStr =
`#version 300 es
uniform mat4 modelViewProjectionMatrix;in vec3 vertex_position;out vec4 v_position;
void main(){gl_Position=modelViewProjectionMatrix*vec4(vertex_position,1.0);v_position=gl_Position;}`;


// raycasting fragment shader
var rayCastingFragmentShaderStr =
`#version 300 es
precision mediump float;precision mediump sampler3D;
#define NUM_RAY_STEPS 512
uniform float step_size;uniform sampler2D frontface_buffer;uniform sampler2D backface_buffer;uniform sampler3D volume_texture;
uniform sampler2D trfunc_texture;in vec4 v_position;out vec4 fragColor;
void main(){vec2 textureCoord=(v_position.xy/v_position.w+1.0)/2.0;vec4 back_position=texture(backface_buffer,textureCoord);
vec4 front_position=texture(frontface_buffer,textureCoord);vec3 ray_origin=front_position.xyz;
vec3 ray_dir = back_position.xyz-ray_origin;float ray_len=length(ray_dir);vec3 delta_dir=normalize(ray_dir)*step_size;
float delta_dir_len = length(delta_dir);vec4 col_acc=vec4(0.0,0.0,0.0,0.0);float alpha_acc=0.0;float length_acc=0.0;
vec3 ray_pos=ray_origin;for(int i=0;i<NUM_RAY_STEPS;i++){float density=texture(volume_texture,ray_pos).r;vec4 color_sample;
color_sample=texture(trfunc_texture,vec2(density,0.5));float alpha_sample=density*step_size;
col_acc+=(1.0-alpha_acc)*color_sample*alpha_sample*40.0;alpha_acc+=alpha_sample;length_acc+=delta_dir_len;ray_pos+=delta_dir;
if(length_acc>=ray_len||alpha_acc>1.0)break;}fragColor=col_acc;}`;


// raycasting fragment shader (maximum intensity projection)
var rayCastingMIPFragmentShaderStr =
`#version 300 es
precision mediump float;precision mediump sampler3D;
#define NUM_RAY_STEPS 512
uniform float step_size;uniform sampler2D frontface_buffer;uniform sampler2D backface_buffer;uniform sampler3D volume_texture;
uniform sampler2D trfunc_texture;in vec4 v_position;out vec4 fragColor;void main(){
vec2 textureCoord=(v_position.xy/v_position.w+1.0)/2.0;vec4 back_position=texture(backface_buffer, textureCoord);
vec4 front_position=texture(frontface_buffer, textureCoord);vec3 ray_origin=front_position.xyz;
vec3 ray_dir=back_position.xyz-ray_origin;float ray_len=length(ray_dir);vec3 delta_dir=normalize(ray_dir)*step_size;
float delta_dir_len=length(delta_dir);float alpha_acc=0.0;float length_acc=0.0;vec3ray_pos=ray_origin;float max_val=0.0;
for(int i=0;i<NUM_RAY_STEPS;i++){float density = texture(volume_texture,ray_pos).r;float alpha_sample=density*step_size;
alpha_acc+=alpha_sample;max_val=max(max_val,density);length_acc+=delta_dir_len;ray_pos+=delta_dir;
if(length_acc>=ray_len||alpha_acc>1.0)break;}fragColor=texture(trfunc_texture,vec2(max_val,0.5));}`;
