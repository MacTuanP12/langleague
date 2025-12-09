package com.langleague.tools;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbInspector {

    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://127.0.0.1:3307/langleague?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pass = ""; // adjust if you have a password

        System.out.println("Connecting to: " + url);
        try (Connection c = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected.");
            PreparedStatement ps = c.prepareStatement(
                "SELECT COLUMN_NAME, COLUMN_TYPE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?"
            );
            ps.setString(1, "langleague");
            ps.setString(2, "app_user");
            ps.setString(3, "avatar_url");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    System.out.println("avatar_url column info:");
                    System.out.println(" COLUMN_NAME=" + rs.getString("COLUMN_NAME"));
                    System.out.println(" COLUMN_TYPE=" + rs.getString("COLUMN_TYPE"));
                    System.out.println(" DATA_TYPE=" + rs.getString("DATA_TYPE"));
                    System.out.println(" CHARACTER_MAXIMUM_LENGTH=" + rs.getObject("CHARACTER_MAXIMUM_LENGTH"));
                } else {
                    System.out.println("avatar_url column not found in information_schema for app_user");
                }
            }

            // show a few rows that have avatar_url not null
            PreparedStatement ps2 = c.prepareStatement(
                "SELECT au.id, au.user_id, au.avatar_url IS NOT NULL AS has_avatar, SUBSTRING(au.avatar_url,1,200) as sample, u.login FROM app_user au LEFT JOIN jhi_user u ON au.user_id = u.id WHERE au.avatar_url IS NOT NULL LIMIT 10"
            );
            try (ResultSet rs2 = ps2.executeQuery()) {
                System.out.println("Existing app_user rows with avatar_url not null:");
                int count = 0;
                while (rs2.next()) {
                    count++;
                    System.out.println(
                        " id=" + rs2.getLong("id") + " user_id=" + rs2.getLong("user_id") + " login=" + rs2.getString("login")
                    );
                    System.out.println(" sample: " + rs2.getString("sample"));
                }
                if (count == 0) System.out.println(" <none>");
            }
        } catch (Exception e) {
            System.err.println("DB connection/query failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
