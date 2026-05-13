import { UserModel } from '../models/user.model.js';


//  ?__________________   DEMO  _________________________  //

  export const getDemoUser = async () => {

  return await UserModel.findByEmail(
    'demo@test.com'
  );

};

//  ?__________________   DEMO  _________________________  //