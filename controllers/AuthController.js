const Login = require('../model/login')
const jwtHelper = require("../helpers/jwt.helper");

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret";

// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";
 // connect mongodb
const db = require("../db")
let login =  (req, res) => {
  try {
    const user = {
      name: req.body.name,
      pass: req.body.pass,
    };
    Login.find({name: user.name, pass:user.pass}, async function(err, data) {  
    if(data[0]!=undefined) {
    const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
    const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
    tokenList[refreshToken] = {accessToken, refreshToken};
    res.setHeader('x-access-token', accessToken)
    res.setHeader('x-refresh-token',refreshToken)
    return res.status(200).json({accessToken, refreshToken});
    }else{
      console.log(err)
      res.send("sai ten dang nhap hoac mk")
  }
  })
  } catch (error) {
    return res.status(500).json(error);
  }
}

let uploads =  (req, res, next) => {
  const file = req.files
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
}

let refreshToken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.headers['x-refresh-token'];
  // debug("tokenList: ", tokenList);
  // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
  if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
      const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);

      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
      // debug("decoded: ", decoded);
      const user = decoded.data;

      const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);

      // gửi token mới về cho người dùng
      return res.status(200).json({accessToken});
    } catch (error) {
      // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
      debug(error);

      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
};
let friendLists = (req, res) => {
  // Lưu ý khi làm thực tế thì việc lấy danh sách này là query tới DB để lấy nhé. Ở đây mình chỉ mock thôi.
  const friends = [
    {
      name: "Cat: Russian Blue",
    },
    {
      name: "Cat: Maine Coon",
    },
    {
      name: "Cat: Balinese",
    },
  ];
  return res.status(200).json(friends);
}

module.exports = {
  login: login,
  refreshToken: refreshToken,
  uploads: uploads,
  friendLists: friendLists,
}
