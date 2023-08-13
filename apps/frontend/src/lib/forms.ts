// import { err, ok } from "@pokedemo/utils";
// import { fail as svelteFail } from "@sveltejs/kit";
// import { z } from "zod";
//
// // // ripped from zfd codebase
// // type FormDataLikeInput = {
// //     [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
// //     entries(): IterableIterator<[string, FormDataEntryValue]>;
// // };
// //
// // export const validate = <X extends z.ZodTypeAny, Y>(
// //     schema: z.ZodEffects<X, Y, FormData | FormDataLikeInput>,
// //     form: FormData
// // ) => {
// //     const result = schema.safeParse(form);
// //     if (!result.success) return err(result.error.flatten().fieldErrors);
// //     return ok(result.data);
// // };
//
// export const validate = <T>(
//     schema: z.Schema<T>
//     form: FormData,
// ) => {
//     const result = schema.safeParse(form);
//     if (!result.success) return err(result.error.flatten().fieldErrors);
//     return ok(result.data);
// };
//
// const x = validate(zfd.formData({ email: zfd.text() }), {} as any);
// if (x.success) x;
// if (!x.success) x.error.email;
// const y = z.object({ email: z.string() }).safeParse({});
// if (y.success) y;
// if (!y.success) y.error.format().email;
//
// export const fail = <T>(status: number, error: T) => {
//     return svelteFail(status, err(error));
// };
