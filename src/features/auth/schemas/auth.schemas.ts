import { z } from 'zod'

export const registerUserSchema = z
    .object({
        fullName: z
            .string()
            .min(3, 'Informe o nome completo.')
            .max(120, 'O nome está muito longo.'),

        cpf: z
            .string()
            .min(11, 'CPF inválido.')
            .max(14, 'CPF inválido.'),

        birthDate: z
            .string()
            .min(1, 'Informe a data de nascimento.'),

        email: z
            .email('Informe um e-mail válido.'),

        phone: z
            .string()
            .min(8, 'Informe um telefone válido.')
            .max(20, 'Telefone inválido.'),

        username: z
            .string()
            .min(3, 'O username deve ter pelo menos 3 caracteres.')
            .max(30, 'O username deve ter no máximo 30 caracteres.')
            .regex(
                /^[a-zA-Z0-9._-]+$/,
                'Use apenas letras, números, ponto, underline ou hífen.',
            ),

        password: z
            .string()
            .min(6, 'A senha deve ter pelo menos 6 caracteres.')
            .max(50, 'A senha deve ter no máximo 50 caracteres.'),

        confirmPassword: z
            .string()
            .min(6, 'Confirme a senha.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não conferem.',
        path: ['confirmPassword'],
    })

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'Informe o username.'),

    password: z
        .string()
        .min(1, 'Informe a senha.'),

    tokenCode: z
        .string()
        .min(1, 'Digite o código exibido na tela.'),
})

export type RegisterUserSchema = z.infer<typeof registerUserSchema>
export type LoginSchema = z.infer<typeof loginSchema>