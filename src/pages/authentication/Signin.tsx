import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Col, Row, Form, Card, Button, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";

//import BgImage from "../../assets/img/illustrations/signin.svg";
import HPTIcon from "../../assets/img/hptIconKnowingIT.png";
import SignInImage from "../../assets/img/signin-side-image.png";
import { CustomRoutes } from "../../customRoutes";
import { GetUserId } from "../../data/UsersId";

export default () => {
  sessionStorage.clear();
  const [form] = Form.useForm();

  let navigate = useNavigate();

  const username = Form.useWatch("username", form);
  const password = Form.useWatch("password", form);

  const routeChange = (serviceUrl: string) => {
    //e.preventDefault()
    //do some fetch here
    //console.log(name)
    const formInput = {
      username: { username }.username,
      password: { password }.password,
    };

    console.log(JSON.stringify(formInput));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify(formInput),
    };

    fetch(serviceUrl, requestOptions)
      .then((res) => {
        console.log("RES TEXT", res);
        return res.text();
      })
      .then((resText) => {
        if (resText.includes("Error")) {
          alert("Failed to login");
          //setShowDefault(true)
        } else {
          console.log("Success", resText);
          //get userId
          GetUserId("/api/users/getuserid", { username }.username).then((r) => {
            if(r !== ""){
            sessionStorage.setItem("user_id", r as string);
            navigate(CustomRoutes.HomePage.path);
            }
            else{
              alert("Wrong")
            }
          });
        }
      })
      .catch((error) => {
        alert(error.body);
      });
  };

  return (
    <>
      <main>
        <center>
          <div
            className="bg-image"
            style={{
              backgroundImage: `url(${SignInImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundColor: "rgba(228, 240, 244, 1)",
              height: "100vh",
              width: "100vw",
            }}
          >
            <Card
              style={{
                width: "30%",
                float: "right",
                height: "90%",
                marginRight: "1%",
                marginTop: "5vh",
              }}
            >
              <div>
                <div
                  className="w-100 position-relative"
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <img
                      style={{
                        marginTop: "5vh",
                        marginBottom: "5vh",
                      }}
                      src={HPTIcon}
                      alt="HPTIcon"
                    />
                    <h3
                      style={{
                        marginBottom: "5vh",
                      }}
                      className="mb-0 mt-5"
                    >
                      Đăng nhập
                    </h3>
                  </div>
                  <Form form={form} layout="vertical">
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                        { type: "string", min: 6 },
                      ]}
                    >
                      <Input placeholder="Nhap username" />
                    </Form.Item>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        { type: "string"},
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhap password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      block
                      onClick={() => routeChange("api/users/authen")}
                    >
                      Đăng nhập
                    </Button>
                  </Form>
                </div>
              </div>
            </Card>
          </div>
        </center>
      </main>
    </>
  );
};
