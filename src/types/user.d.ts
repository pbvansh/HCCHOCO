export type UserRoles = 'O' | 'A' | 'T'

export type OwnerDetail = {
  ownerId: string
  role: UserRoles
}

export type OwnerDetailArray = OwnerDetail[]
