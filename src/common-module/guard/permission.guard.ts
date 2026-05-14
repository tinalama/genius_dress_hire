// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Reflector } from '@nestjs/core';

// // TODO: Replace with actual configuration when permission system is implemented
// interface RoutePayloadInterface {
//   url: string;
//   method: string;
// }

// // TODO: Replace with actual configuration when permission system is implemented
// const PermissionConfiguration = {
//   defaultRoutes: []
// };

// // TODO: Replace with actual User entity when permission system is implemented
// interface UserEntity {
//   is_first_login: boolean;
//   role: {
//     id: number;
//     permission: any[];
//   };
// }

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   /**
//    * check if user authorized
//    * @param context
//    */
//   canActivate(
//     context: ExecutionContext
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const url = request.route.path;
//     const method = request.method.toLowerCase();
//     const permissionPayload: RoutePayloadInterface = {
//       url,
//       method
//     };

//     // If no user is attached to request, deny access
//     if (!request.user) {
//       return false;
//     }

//     if (request.user.is_first_login) {
//       return false;
//     }

//     const permitted = this.checkIfDefaultRoute(permissionPayload);
//     if (permitted) {
//       return true;
//     }

//     const requiredPermissions = this.reflector.get<string[]>(
//       'permissions',
//       context.getHandler()
//     );

//     if (requiredPermissions?.length) {
//       return this.hasRequiredPermissions(request.user, requiredPermissions);
//     }

//     return this.checkIfUserHavePermission(request.user, permissionPayload);
//   }

//   /**
//    * check if route is default
//    * @param permissionAgainst
//    */
//   checkIfDefaultRoute(permissionAgainst: RoutePayloadInterface) {
//     const { url } = permissionAgainst;
//     const normalizedPath = url.replace('/api/v1', '');

//     const { defaultRoutes } = PermissionConfiguration;
//     return defaultRoutes.some(
//       (route) => route.url === normalizedPath
//     );
//   }

//   /**
//    * check if user have necessary permission to view resource
//    * @param user
//    * @param permissionAgainst
//    */
//   checkIfUserHavePermission(
//     user: UserEntity,
//     permissionAgainst: RoutePayloadInterface
//   ) {
//     const { url } = permissionAgainst;
//     if (user.role.id === 1) {
//       return true;
//     }
//     if (user?.role?.permission) {
//       // Remove /api/v1 prefix from path for comparison
//       const normalizedPath = url.replace('/api/v1', '');
//       return user.role.permission.some(
//         (route) => route.url === normalizedPath || route.slug
//       );
//     }
//     return false;
//   }

//   private hasRequiredPermissions(
//     user: UserEntity,
//     requiredPermissions: string[]
//   ): boolean {
//     if (user.role.id === 1) {
//       return true; // Admin role bypass
//     }

//     const userPermissions = user.role.permission.map(
//       (permission) => permission.slug
//     );

//     // Append default route slugs that have a slug property
//     const defaultRouteSlugs = PermissionConfiguration.defaultRoutes
//       .filter((route) => route.slug)
//       .map((route) => route.slug);

//     const allUserPermissions = new Set([
//       ...userPermissions,
//       ...defaultRouteSlugs
//     ]);

//     return requiredPermissions.some((permission) =>
//       allUserPermissions.has(permission)
//     );
//   }
// }
