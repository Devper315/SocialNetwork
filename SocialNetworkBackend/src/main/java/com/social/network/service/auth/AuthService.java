package com.social.network.service.auth;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.social.network.dto.request.auth.IntrospectRequest;
import com.social.network.dto.request.auth.LoginRequest;
import com.social.network.dto.response.auth.IntrospectResponse;
import com.social.network.dto.response.auth.LoginResponse;
import com.social.network.entity.user.User;
import com.social.network.exception.AppException;
import com.social.network.exception.ErrorCode;
import com.social.network.repository.user.UserRepo;
import com.social.network.utils.DateUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthService {
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.validDuration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshableDuration}")
    protected long REFRESHABLE_DURATION;

    public LoginResponse authenticate(LoginRequest request) {
        User user = userRepo.findByUsername(request.getUsername().toLowerCase());
        if (user == null) throw new AppException(ErrorCode.UNAUTHENTICATED);
        boolean result = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!result) throw new AppException(ErrorCode.UNAUTHENTICATED);
        String token = generateToken(user);
        return LoginResponse.builder()
                .token(token)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        String token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (Exception e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    public String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("devper315")
                .issueTime(new Date())
                .expirationTime(DateUtils.addSecondsToDate(new Date(), VALID_DURATION))
                .jwtID(UUID.randomUUID().toString())
                .claim("customClaim", buildCustomClaim(user))
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            e.printStackTrace();
            return "Không thể tạo token";
        }
    }

    public Map<String, Object> buildCustomClaim(User user) {
        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("fullName", user.getFullname());
        customClaims.put("role", user.getRoles());
        customClaims.put("username", user.getUsername());
        customClaims.put("id", user.getId());
        return customClaims;
    }

    private void verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
        Date expiryTime = claimsSet.getExpirationTime();
        boolean verified = signedJWT.verify(verifier);
        if (!(verified && expiryTime.after(new Date()))){
            throw new RuntimeException("Token không hợp lệ");
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                joiner.add("ROLE_" + role.getName());
//				if (!role.getPermissionSet().isEmpty())
//					role.getPermissionSet().forEach(permission -> joiner.add(permission.getName()));
            });
        }
        return joiner.toString();
    }
}