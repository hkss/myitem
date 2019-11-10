<!--  -->
<template>
    <div class="feedbackViewPage">
      <van-nav-bar
        fixed
        title="故障反馈"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
      <div class="topblank"></div>
      <div class="questionCon">
        <p>床柜出现故障关不上？请把情况反馈给我们</p>
        <h4 class="backQues">反馈问题</h4>
        <div class="selectQues">
          <!-- 复选 -->
          <!-- <van-checkbox-group v-model="result">
            <van-cell-group>
              <div class="checkText">
                <van-row gutter="20">
                  <van-col
                    span="8"
                    v-for="(itemText, index) in selectQues"
                    clickable
                    :key="index"
                  >
                    <van-button
                      size="small"
                      ref="checkboxBtn"
                      @click="toggle(index)"
                    >{{ itemText.bed }}</van-button>
                  </van-col>
                </van-row>
              </div>
              <div class="checkbox">
                <van-row gutter="20">
                  <van-col
                    span="8"
                    v-for="(item, index) in list"
                    clickable
                    :key="index"
                  >
                    <van-button size="small">
                      <van-checkbox
                        :name="item"
                        ref="checkboxes"
                      ></van-checkbox>
                    </van-button>
                  </van-col>
                </van-row>
              </div>
            </van-cell-group>
          </van-checkbox-group> -->
          <!-- 单选 -->
          <van-radio-group v-model="resultRadio">
            <van-cell-group>
              <div class="">
                <van-row gutter="20">
                  <van-col
                    span="8"
                    v-for="(itemText, index) in selectQues"
                    clickable
                    :key="index"
                  >
                    <van-cell
                      clickable
                      @click="radioClick(index)"
                      :class="{
                                                radioActive: index == num
                                            }"
                      ref="radioBtn"
                    >
                      <van-radio :name="index">{{
                        itemText.bed
                        }}</van-radio>
                    </van-cell>
                  </van-col>
                </van-row>
              </div>
            </van-cell-group>
          </van-radio-group>
        </div>

        <h4>其他问题</h4>
        <div class="textarea">
          <van-cell-group>
            <van-field
              type="textarea"
              rows="1"
              v-model="message"
              placeholder="请简要说明在使用床柜中遇到的问题，以便工作人员进行判断和处理"
            />
            <div class="uploader">
              <!-- 上传多张图片 -->
              <!-- <div style="width: 502px;">
                                <uploader :src="'/api/breakdown'"></uploader>
                            </div> -->
              <!-- 上传一张图片 -->
              <div class="upload">
                <van-uploader
                  :after-read="onRead"
                  accept="image/*"
                  multiple
                  ref="uploader"
                >
                  <img
                    src="../../../static/img/upload.png"
                    class="uploadImg"
                  />
                  <span>可添加图片</span>
                </van-uploader>
                <div
                  class="uploadImgBg"
                  ref="uploadImgBg"
                >
                  <img
                    @click="selectFile"
                    src="../../../static/img/upload.png"
                    class="uploadImg"
                    ref="uploadImg"
                  />
                  <span>可预览图片</span>
                </div>
              </div>
            </div>
          </van-cell-group>
        </div>
      </div>
      <div class="submitQues">
        <van-button
          type="default"
          @click="submitQues"
        >
          提交反馈
        </van-button>
        <van-popup
          v-model="submitStatus"
          :close-on-click-overlay=false
        >
          <div class="result">
            <div
              class="success"
              v-if="type == 0"
            >
              <img
                src="../../../static/img/success.png"
                slot="right"
              />
              <p>提交成功</p>
            </div>
            <div
              class="failure"
              v-if="type == 1"
            >
              <img
                src="../../../static/img/failure.png"
                slot="right"
              />
              <p>支付失败!</p>
            </div>
          </div>
          <div
            class="bottomQues"
            @click="backIndex"
          >返回首页</div>
        </van-popup>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { breakdownClose } from "api/bed";
import { ERR_OK } from "api/config";
import axios from "axios";
import uploader from "base/upload/upload";
import { ImagePreview } from "vant";

export default {
  components: { uploader },
  data() {
    // 这里存放数据
    return {
      submitStatus: false,
      list: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      result: [],
      resultRadio: "",
      num: Number,
      type: Number,
      checked: true,
      message: "",
      fileName: "",
      selectQues: [
        { bed: "床柜损坏" },
        { bed: "床柜损坏" },
        { bed: "电池没电" },
        { bed: "床锁损坏" },
        { bed: "床柜损坏" },
        { bed: "床柜损坏" },
        { bed: "电池没电" },
        { bed: "床锁损坏" },
        { bed: "其他问题" }
      ]
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["feedback", "orderUseState", "refund"])
  },
  // 监控data中的数据变化
  watch: {
    result(newVal, oldVal) {
      console.log(newVal);
    },
    resultRadio(newVal, oldVal) {
      console.log(newVal);
    }
  },
  // 方法集合
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onRead(item) {
      this.fileName = item.file;
      this.$refs.uploadImg.src = item.content;
      this.$refs.uploader.$el.style.display = "none";
      this.$refs.uploadImgBg.style.display = "block";
    },
    selectFile() {
      ImagePreview([this.$refs.uploadImg.src]);
    },
    _getData() {
    },
    submitQues() {
      if(this.resultRadio==''){
        this.$toast("您还未选择反馈的问题")
        return false
      }
       if(this.fileName==''){
        this.$toast("图片必传")
        return false
      }
      var user_id = localStorage.getItem("id")
        ? localStorage.getItem("id")
        : "";
      if (user_id != "") {
        let param = new FormData(); // 创建form对象
        param.append("bed_image", this.fileName); // 通过append向form对象添加数据
        param.append("user_id", user_id); // 添加form表单中其他数据
        param.append("chaperonage_bed_code", this.$route.params.code); // 添加form表单中其他数据
        param.append("problem_state", this.resultRadio); // 添加form表单中其他数据
        param.append("problem_description", this.message); // 添加form表单中其他数据
        var data = param;
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        axios.post("/breakdown", param, config).then(res => {
          if (res.data.error_code * 1 === ERR_OK) {
            this.submitStatus = true;
            this.resultRadio = "";
            this.message = "";
            this.type = res.data.error_code * 1;
      this.setTabActive(1)
            this.setUsedingState({
              usedoing: false,
              res: ''
            });
            this.setWayisshow({
              state: false
            })
          }
        });
      }
    },
    backIndex() {
      this.$router.push({
        path: `/bed`
      });
    },
    radioClick(index) {
      this.resultRadio = index;
      this.num = index;
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {
        this.$refs.checkboxBtn[index].$el.style.border =
          "1px solid red";
        this.$refs.checkboxBtn[index].$el.style.color = "red";
      } else {
        this.$refs.checkboxBtn[index].$el.style.border = "";
        this.$refs.checkboxBtn[index].$el.style.color = "";
      }
    },
    ...mapMutations({
      setFeedBackState: "SET_FEEDBACK",
      setTrueManger: "SET_BEDMANAGER",
      setOrderUseState: "SET_ORDER_USE_STATE",
      setUsedingState: "SET_USEDING_STATE",
      setTabActive: "SET_ACTIVE",
      setWayisshow: "SET_WAYISSHOW"
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // console.log(this.result)
  },
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { } // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="stylus">
// @import url(); 引入公共css类
.feedbackViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;

  .questionCon {
    font-size: 14px;

    p {
      margin: 8px 15px;
      color: #999;
    }

    h4 {
      background: #fff;
      line-height: 40px;
      margin: 0;
      padding-left: 15px;
      font-weight: 600;
      font-size: 15px;
      border-bottom: 1px solid #ededed;
    }

    .selectQues {
      padding: 5px 15px;
      background: #fff;
      border-bottom: 1px solid #ededed;
      margin-bottom: 10px;

      .van-row {
        margin-bottom: 15px;

        .van-col {
          margin-top: 10px;

          .van-button, .van-cell {
            width: 100%;
            border-radius: 5px;
            height: 100%;
            padding: 2px 0;
            color: #999;
            font-size: 12px;
            line-height: 25px;
          }

          .van-cell {
            border: 1px solid #ededed;
          }
        }
      }

      .checkbox {
        .van-row {
          display: none;
        }
      }
    }

    .textarea {
      .van-field {
        color: #999;
      }

      .uploader {
        padding: 10px 15px;

        .upload {
          .uploadImg {
            width: 60px;
            height: 60px;
          }

          span {
            color: #999;
          }

          .uploadImgBg {
            display: none;

            .uploadImg {
              // width: 100px;
              // height: 120px;
            }
          }
        }
      }
    }
  }

  .submitQues {
    width: 94%;
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;

    .van-button {
      width: 100%;
      background: #4fd6bc;
      color: #fff;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
    }

    .van-popup {
      height: 350px;
      width: 250px;
      border-radius: 5px;

      .result {
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        margin-top: -45%;
        text-align: center;

        img {
          width: 70px;
          height: 70px;
        }

        .success {
          p {
            margin: 20px 0 0px;
            color: #4fd6bc;
          }
        }

        .failure {
          p {
            margin: 40px 0 0px;
            color: orange;
          }
        }
      }

      .bottomQues {
        position: absolute;
        bottom: 50px;
        text-align: center;
        width: 100%;

        a {
          color: #999;
        }
      }
    }
  }
}
</style>
