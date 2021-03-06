import uploadFile from '@/components/uploadFile/uploadFile.vue'
import openBox from "@/components/openBox/openBox.vue";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import myUploadAdapter from "./myUploadAdapter";
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import MyUploadAdapter_inner from "./myUploadAdapter-inner";


// ClassicEditor.builtinPlugins = [Base64UploadAdapter];

export default {
    name: 'App',
    data() {
        return {
            openFileDialog: false,
            attachmentFromData: {
                remark: "",
                name: "",
                attachPressId: ""
            },
            action: '/api/File/onPostUploadAsync',
            filterText: '',
            loading: false,
            user: {},
            //表格数据
            role16: [],
            role20: [],
            menu16: [],
            menu20: [],
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                // The configuration of the editor.
                simpleUpload: {
                    // The URL the images are uploaded to.
                    uploadUrl: 'http://example.com',

                    // Headers sent along with the XMLHttpRequest to the upload server.
                    headers: {}
                },
            }
        }
    },
    computed: {
        headers() {
            return {
                Accept: 'application/json',
            }
        },
    },
    components: {
        uploadFile,
        openBox
    },
    methods: {
        onEditorReady(ceditor) {
            ceditor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                // Configure the URL to the upload script in your back-end here!
                return new MyUploadAdapter_inner(loader);
            };
            console.log(ceditor.plugins)
        },
        test() {
            console.log(this.editorData)
        },
        doUpload() {
            let _this = this;
            _this.openFileDialog = true;
        },
        handleSuccess(response) {
            console.log(response)
        },
        doSearch() {
            let _this = this;
            if (_this.filterText.trim()) {
                _this.loading = true;
                _this.$http.request('/api/Verify/getUserRoleAndBusByName', {userName: _this.filterText.trim()}, () => {
                    _this.loading = false;
                }, 'GET').then(data => {
                    console.log(data)
                    if (data.errorCode === 200) {
                        _this.user = data.data.user;
                        _this.menu16 = data.data.menus;
                        _this.role16 = data.data.roles;
                        _this.menu20 = data.data.menus20;
                        _this.role20 = data.data.roles20;
                    } else {
                        _this.$infoAlert(data.errorMessage)
                    }
                }, reason => {
                    console.log(reason)
                    _this.$infoAlert("服务器内部错误!")
                })
            } else {
                _this.$infoAlert("请输入查询文本")
            }
        }
    }
}
