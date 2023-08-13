// TODO: put here signup/login client form validation code
import { zfd } from "zod-form-data";
import { z } from "zod";

// export const authForm = zfd.formData({
//     email: zfd.text(z.string().email()),
//     password: zfd.text()
// });
export const authForm = z.object({
    email: z.string().email(),
    password: z.string()
});
